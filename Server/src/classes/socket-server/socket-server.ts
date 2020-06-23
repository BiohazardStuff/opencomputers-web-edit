import * as WebSocket from "ws";
import { Server as WebSocketServer } from "ws";

import SocketServerManager from "../socket-server-manager";
import { PayloadBase } from "../../constant/interfaces/client-payloads";
import { IncomingMessage } from "http";
import { Socket } from "net";
import WebSocketClient from "../socket-client/web-socket-client";
import Logger from "../logger";
import DestinationServer from "../../constant/enums/destination-server";
import MessageAction from "../../constant/enums/message-action";
import SocketClient from "../socket-client/socket-client";


export default abstract class SocketServer {
  private _clients: Map<string, SocketClient>;
  private _eventHandlers: Map<MessageAction, Function>;
  private _eventPassthroughs: Map<MessageAction, DestinationServer>;

  protected _socketServer: WebSocketServer;

  protected constructor(protected _parent: SocketServerManager) {
    // SocketClients by Computer UUID
    this._clients = new Map<string, SocketClient>();

    this._eventHandlers = new Map<MessageAction, Function>();
    this._eventPassthroughs = new Map<MessageAction, DestinationServer>();
  }

  // region Private Variable Access

  public hasClient(uuid: string): boolean {
    return this._clients.has(uuid);
  }

  public getClientByUUID(uuid: string): SocketClient|undefined {
    return this._clients.get(uuid);
  }

  public addClient(client: SocketClient, uuid: string): void {
    this._clients.set(uuid, client);
  }

  // endregion

  public register(): void {
    this._socketServer = new WebSocketServer({
      noServer: true,
    });

    this._socketServer.on(
      "connection",
      this.onConnectionInternal.bind(this)
    );
  }

  public handleUpgrade(request: IncomingMessage, socket: Socket, head: Buffer) {
    this._socketServer.handleUpgrade(request, socket, head, websocket => {
      this._socketServer.emit("connection", websocket, request);
    });
  }

  protected static parseRawMessage(rawMessage: string): PayloadBase {
    return JSON.parse(rawMessage);
  }

  public emulateMessage(client: SocketClient, message: PayloadBase): void {
    this.onMessageInternal(client, message);
  }

  // region Event Logic

  protected registerEventHandler(action: MessageAction, callback: Function): void {
    this._eventHandlers.set(action, callback);
  }

  protected hasEventHandler(action: MessageAction): boolean {
    return this._eventHandlers.has(action);
  }

  protected callEventHandler(client: SocketClient, message: PayloadBase): void {
    const handler: Function = this._eventHandlers.get(message.action)!;

    Logger.info(`Executing callback for ${ message.action }`);

    handler(this, client, message.data);
  }

  protected callEventHandlerOrError(client: SocketClient, message: PayloadBase): void {
    if (!this.hasEventHandler(message.action)) {
      return client.sendError(`Unknown action: ${ message.action }`);
    }

    this.callEventHandler(client, message);
  }

  protected registerEventPassthrough(action: MessageAction, destination: DestinationServer): void {
    this._eventPassthroughs.set(
      action,
      destination
    );
  }

  protected hasEventPassthrough(action: MessageAction): boolean {
    return this._eventPassthroughs.has(action);
  }

  protected getEventPassthrough(action: MessageAction): DestinationServer|undefined {
    return this._eventPassthroughs.get(action);
  }

  // endregion

  //region Core Event Handlers

  private onConnectionInternal(webSocketClient: WebSocket): void {
    Logger.info("Client Connected");

    const client: SocketClient = new WebSocketClient(webSocketClient);

    webSocketClient.on(
      "message",
      rawMessage => this.onMessageInternal(
        client,
        SocketServer.parseRawMessage(rawMessage.toString())
      )
    );

    webSocketClient.on(
      "close",
      SocketServer.onClose
    );

    this.onConnection(client);

    client.sendMessage(MessageAction.CONNECTED);
  }

  protected onConnection(_client: SocketClient): void {
  }

  protected static onClose(): void {
    Logger.info("Client Disconnected");
  }

  private onMessageInternal(client: SocketClient, message: PayloadBase): void {
    Logger.info(`Received: ${ JSON.stringify(message) }`);

    if (message.action == undefined) {
      return;
    }

    if (this.hasEventPassthrough(message.action)) {
      const destination: DestinationServer = this.getEventPassthrough(message.action)!;

      return this._parent.passthroughMessage(client, destination, message);
    }

    this.onMessage(client, message);
  }

  protected onMessage(client: SocketClient, message: PayloadBase): void {
    this.callEventHandlerOrError(client, message);
  }

  // endregion
}

