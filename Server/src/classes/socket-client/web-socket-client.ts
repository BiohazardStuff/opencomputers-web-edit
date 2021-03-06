import * as WebSocket from "ws";

import ErrorCode from "../../constant/enums/error-code";
import MessageAction from "../../constant/enums/message-action";
import SocketClient from "./socket-client";

export default class WebSocketClient implements SocketClient {
  constructor(private _socketClient: WebSocket) {
  }

  public sendMessage(action: MessageAction, data: object = {}): void {
    this._socketClient.send(JSON.stringify({
      action,
      data,
    }));
  }

  public sendError(message: string, code: number = ErrorCode.GENERAL): void {
    this.sendMessage(
      MessageAction.ERROR,
      {
        message,
        code,
      }
    );
  }
}
