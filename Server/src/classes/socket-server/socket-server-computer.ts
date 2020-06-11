import SocketServer from "./socket-server";
import ClientAction from "../../constant/enums/client-action";
import { PayloadBase } from "../../constant/interfaces/client-payloads";
import SocketServerManager from "../socket-server-manager";
import { Handshake } from "../../modules/handshake";
import SocketClient from "../socket-client";
import Computer from "../container/computer";

export default class SocketServerComputer extends SocketServer {
  private _computers: Map<string, Computer>;
  private _clients: Map<string, SocketClient>;
  private _uuidByAccessCode: Map<string, string>;

  constructor(parent: SocketServerManager) {
    super(parent);

    this._computers = new Map<string, Computer>();
    this._clients = new Map<string, SocketClient>();
    this._uuidByAccessCode = new Map<string, string>();

    this.registerEventHandler(ClientAction.CONFIRM_CONNECTION, Handshake.onConfirmConnection);
    this.registerEventHandler(ClientAction.AUTHENTICATE, Handshake.onAuthenticate);
  }

  // region Private Variable Access

  public hasComputer(uuid: string): boolean {
    return this._computers.has(uuid);
  }

  public getComputerByUUID(uuid: string): Computer|undefined {
    return this._computers.get(uuid);
  }

  public getComputerByAccessCode(accessCode: string): Computer|undefined {
    const uuid: string|undefined = this._uuidByAccessCode.get(accessCode);
    if (uuid === undefined) {
      return undefined;
    }

    return this.getComputerByUUID(uuid);
  }

  public addComputer(computer: Computer): void {
    this._computers.set(computer.uuid, computer);
    this._uuidByAccessCode.set(computer.accessCode, computer.uuid);
  }

  public hasClient(uuid: string): boolean {
    return this._clients.has(uuid);
  }

  public getClientByUUID(uuid:string): SocketClient|undefined {
    return this._clients.get(uuid);
  }

  public addClient(client: SocketClient, uuid: string): void {
    this._clients.set(uuid, client);
  }

  // endregion

  protected onMessage(client: SocketClient, message: PayloadBase): void {

    if (message.data.uuid === undefined) {
      return client.sendError("Missing required data: uuid");
    }

    // Messages from computers not yet in the list are only allowed to use the confirm path
    if (
      message.action != ClientAction.CONFIRM_CONNECTION &&
      !this.hasComputer(message.data.uuid)
    ) {
      return client.sendError("Attempted to perform action on unconfirmed connection");
    }

    this.callEventHandlerOrError(client, message);
  }

}
