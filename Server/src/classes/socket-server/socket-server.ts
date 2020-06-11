import * as WebSocket from "ws";
import { Server as WebSocketServer } from "ws";

import ClientAction from '../../constant/enums/client-action';
import SocketServerManager from '../socket-server-manager';
import ServerAction from '../../constant/enums/server-action';
import { PayloadBase } from '../../constant/interfaces/client-payloads';
import { IncomingMessage } from 'http';
import { Socket } from 'net';
import SocketClient from '../socket-client';
import Logger from '../logger';


export default abstract class SocketServer {
  private _eventHandlers: Map<ClientAction, Function>;

  protected _socketServer: WebSocketServer;

  protected constructor(protected _parent: SocketServerManager) {
    this._eventHandlers = new Map<ClientAction, Function>();
  }

  public register(): void {
    this._socketServer = new WebSocketServer({
      noServer: true,
    });

    this._socketServer.on(
      "connection",
      this.onConnectionInternal.bind(this)
    )
  }

  public handleUpgrade(request: IncomingMessage, socket: Socket, head: Buffer) {
    this._socketServer.handleUpgrade(request, socket, head, websocket => {
      this._socketServer.emit("connection", websocket, request);
    });
  }

  // region Event Handler Logic

  protected registerEventHandler(clientAction: ClientAction, callback: Function): void {
    this._eventHandlers.set(clientAction, callback);
  }

  protected hasEventHandler(clientAction: ClientAction): boolean {
    return this._eventHandlers.has(clientAction);
  }

  protected callEventHandler(client: SocketClient, message: PayloadBase): void {
    const handler: Function = this._eventHandlers.get(message.action)!;

    Logger.info(`Executing callback for ${ message.action }`);

    handler(this, client, message.data);
  }

  protected callEventHandlerOrError(client: SocketClient, message: PayloadBase): void {
    if (!this.hasEventHandler(message.action)) {
      return client.sendError(`Unknown action: ${message.action}`);
    }

    this.callEventHandler(client, message);
  }

  // endregion

  //region Core Event Handlers

  private onConnectionInternal(webSocketClient: WebSocket): void {
    Logger.info("Client Connected");

    const client: SocketClient = new SocketClient(webSocketClient);

    webSocketClient.on(
      "message",
      rawMessage => this.onMessageInternal(client, rawMessage.toString())
    );

    webSocketClient.on(
      "close",
      SocketServer.onClose
    );

    this.onConnection(client);

    client.sendMessage(ServerAction.CONNECTED);
  }

  protected onConnection(client: SocketClient): void {}

  protected static onClose(): void {
    Logger.info('Client Disconnected');
  }

  private onMessageInternal(client: SocketClient, rawMessage: string): void {
    Logger.info(`Received: ${ rawMessage }`);

    const message: PayloadBase = JSON.parse(rawMessage.toString());
    if (message.action == undefined) {
      return;
    }

    this.onMessage(client, message);
  }

  protected onMessage(client: SocketClient, message: PayloadBase): void {
    this.callEventHandlerOrError(client, message);
  }

  // endregion
}

