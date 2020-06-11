import * as WebSocket from 'ws';

import ServerAction from '../constant/enums/server-action';
import ErrorCode from '../constant/enums/error-code';

export default class SocketClient {
  constructor(private _socketClient: WebSocket) {}

  public sendMessage(action: ServerAction, data: object = {}): void {
    this._socketClient.send(JSON.stringify({
      action,
      data,
    }));
  }

  public sendError(message: string, code: number = ErrorCode.GENERAL): void {
    this.sendMessage(ServerAction.ERROR, {
      message,
      code,
    });
  }
}
