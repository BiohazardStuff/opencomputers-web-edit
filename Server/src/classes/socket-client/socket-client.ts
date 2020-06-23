import MessageAction from "../../constant/enums/message-action";

export default interface SocketClient {
  sendMessage(action: MessageAction, data?: object): void,
  sendError(message: string, code?: number): void,
}
