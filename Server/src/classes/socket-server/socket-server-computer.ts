import SocketServer from "./socket-server";
import { PayloadBase } from "../../constant/interfaces/client-payloads";
import SocketServerManager from "../socket-server-manager";
import { HandshakeCallbacks } from "../../modules/handshake";
import SocketClient from "../socket-client";
import Computer from "../container/computer";
import MessageAction from "../../constant/enums/message-action";
import DestinationServer from "../../constant/enums/destination-server";

export default class SocketServerComputer extends SocketServer {
  private _computers: Map<string, Computer>;
  private _uuidByAccessCode: Map<string, string>;

  constructor(parent: SocketServerManager) {
    super(parent);

    // Computers by UUID
    this._computers = new Map<string, Computer>();

    // Maps Computer UUID to Access Codes
    this._uuidByAccessCode = new Map<string, string>();

    this.registerEventPassthrough(MessageAction.PUSH_DIRECTORY, DestinationServer.WEB);

    this.registerEventHandler(MessageAction.CONFIRM_CONNECTION, HandshakeCallbacks.onConfirmConnection);
    this.registerEventHandler(MessageAction.AUTHENTICATE, HandshakeCallbacks.onAuthenticate);
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

  // endregion

  protected onMessage(client: SocketClient, message: PayloadBase): void {

    if (message.data.uuid === undefined) {
      return client.sendError("Missing required data: uuid");
    }

    // Messages from computers not yet in the list are only allowed to use the confirm path
    if (
      message.action != MessageAction.CONFIRM_CONNECTION &&
      !this.hasComputer(message.data.uuid)
    ) {
      return client.sendError("Attempted to perform action on unconfirmed connection");
    }

    this.callEventHandlerOrError(client, message);
  }

}
