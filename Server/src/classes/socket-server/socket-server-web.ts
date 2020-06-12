import SocketServer from "./socket-server";
import SocketServerManager from "../socket-server-manager";
import WebHandlers from "../../modules/web-handlers";
import Computer from "../container/computer";
import DestinationServer from "../../constant/enums/destination-server";
import MessageAction from "../../constant/enums/message-action";

export default class SocketServerWeb extends SocketServer {
  constructor(parent: SocketServerManager) {
    super(parent);

    this.registerEventPassthrough(MessageAction.PULL_DIRECTORY, DestinationServer.COMPUTER);

    this.registerEventHandler(MessageAction.CHECK_ACCESS_CODE, WebHandlers.onCheckAccessCode);
  }

  public getComputerByAccessCode(accessCode: string): Computer|undefined {
    return this._parent.getComputerByAccessCode(accessCode);
  }
}
