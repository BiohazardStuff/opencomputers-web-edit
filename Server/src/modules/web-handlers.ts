import { CheckAccessCodePayload } from "../constant/interfaces/client-payloads";
import SocketClient from "../classes/socket-client";
import Logger from "../classes/logger";
import SocketServerWeb from "../classes/socket-server/socket-server-web";
import Computer from "../classes/container/computer";
import MessageAction from "../constant/enums/message-action";

export default class WebHandlers {
  public static onCheckAccessCode(server: SocketServerWeb, client: SocketClient, data: CheckAccessCodePayload): void {
    Logger.info(`Web client checking with access code ${ data.accessCode }`);

    const computer: Computer|undefined = server.getComputerByAccessCode(data.accessCode);
    if (computer === undefined) {
      return client.sendError(`No computer client found with access code ${ data.accessCode }`);
    }

    server.addClient(client, computer.uuid);

    client.sendMessage(
      MessageAction.CONFIRM_ACCESS_CODE,
      {
        uuid: computer.uuid,
        accessCode: computer.accessCode,
      }
    );
  }
}
