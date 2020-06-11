import * as http from "http";
import { IncomingMessage, Server } from "http";
import * as url from "url";
import { Socket } from 'net';

import SocketServerComputer from './socket-server/socket-server-computer';
import SocketServerWeb from './socket-server/socket-server-web';
import SocketServer from './socket-server/socket-server';

export default class SocketServerManager {
  private _pathMap: Map<string, SocketServer>;
  private _socketServerComputer: SocketServerComputer;
  private _socketServerWeb: SocketServerWeb;

  constructor() {
    this._pathMap = new Map<string, SocketServer>();
  }

  private mapUpgradePaths(): void {
    this._pathMap.set("computer", this._socketServerComputer);
    this._pathMap.set("web", this._socketServerWeb);
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
    const pathname = rawPathname.substr(1);
    if (!this._pathMap.has(pathname)) {
      return socket.destroy();
    }

    const socketServer: SocketServer = this._pathMap.get(pathname)!;

    socketServer.handleUpgrade(request, socket, head);
  }
}
