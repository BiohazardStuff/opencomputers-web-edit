import * as http from "http";
import { IncomingMessage, Server } from "http";
import * as url from "url";
import { Socket } from "net";

import SocketServerComputer from "./socket-server/socket-server-computer";
import SocketServerWeb from "./socket-server/socket-server-web";
import SocketServer from "./socket-server/socket-server";
import Computer from "./container/computer";
import DestinationServer from "../constant/enums/destination-server";
import { PayloadBase } from "../constant/interfaces/client-payloads";
import SocketClient from "./socket-client/socket-client";

export default class SocketServerManager {
  private _destinationMap: Map<DestinationServer, SocketServer>;
  private _socketServerComputer: SocketServerComputer;
  private _socketServerWeb: SocketServerWeb;

  constructor() {
    this._destinationMap = new Map<DestinationServer, SocketServer>();
  }

  private mapUpgradePaths(): void {
    this._destinationMap.set(DestinationServer.COMPUTER, this._socketServerComputer);
    this._destinationMap.set(DestinationServer.WEB, this._socketServerWeb);
  }

  public start(port: number): void {
    const server: Server = http.createServer();

    this._socketServerComputer = new SocketServerComputer(this);
    this._socketServerComputer.register();

    this._socketServerWeb = new SocketServerWeb(this);
    this._socketServerWeb.register();

    this.mapUpgradePaths();

    server.on("upgrade", this.onUpgrade.bind(this));
    server.listen(port);
  }

  private onUpgrade(request: IncomingMessage, socket: Socket, head: Buffer): void {
    if (request.url === undefined) {
      return;
    }

    const rawPathname: string|null = url.parse(request.url).pathname;
    if (rawPathname === null) {
      return socket.destroy();
    }

    // Remove leading slash
    const pathname: string = rawPathname.substr(1);
    const destination: DestinationServer = pathname as DestinationServer;
    if (!this._destinationMap.has(destination)) {
      return socket.destroy();
    }

    const socketServer: SocketServer = this._destinationMap.get(destination)!;

    socketServer.handleUpgrade(request, socket, head);
  }

  // region Cross Communication Methods

  public passthroughMessage(client: SocketClient, destination: DestinationServer, message: PayloadBase) {
    if (message.data.uuid === undefined) {
      return client.sendError("Message missing uuid required for passthrouhg");
    }

    if (!this._destinationMap.has(destination)) {
      return client.sendError(`Unable to determine destination for ${ destination.toString() }`);
    }

    const destinationServer: SocketServer = this._destinationMap.get(destination)!;

    const destinationClient: SocketClient|undefined = destinationServer.getClientByUUID(message.data.uuid);
    if (destinationClient === undefined) {
      return client.sendError(`Unable to determine destination client for ${ message.data.uuid }`);
    }

    destinationClient.sendMessage(
      message.action,
      message.data
    );

    // destinationServer.emulateMessage(destinationClient, message);
  }

  public getComputerByAccessCode(accessCode: string): Computer|undefined {
    return this._socketServerComputer.getComputerByAccessCode(accessCode);
  }

  // endregion
}
