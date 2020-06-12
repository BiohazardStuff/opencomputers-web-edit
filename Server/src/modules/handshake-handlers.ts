import { AuthenticatePayload, ConfirmConnectionPayload } from "../constant/interfaces/client-payloads";
import SocketClient from "../classes/socket-client";
import Logger from "../classes/logger";
import SocketServerComputer from "../classes/socket-server/socket-server-computer";
import Computer from "../classes/container/computer";
import MessageAction from "../constant/enums/message-action";

export class HandshakeHandlers {
  //region Message Event Handlers

  public static onConfirmConnection(server: SocketServerComputer, client: SocketClient, data: ConfirmConnectionPayload): void {
    if (data.uuid == undefined) {
      return client.sendError("Missing required field uuid");
    }

    Logger.info(`Client confirmed connection with UUID: ${data.uuid}`);

    // Redirect existing client to authentication path
    if (server.hasComputer(data.uuid)) {
      Logger.info("Existing client reconnecting. Sending auth message");

      return client.sendMessage(MessageAction.REQUEST_AUTH);
    }

    // New client logic

    const computer: Computer = new Computer(data.uuid);

    server.addComputer(computer);

    server.addClient(client, computer.uuid);

    Logger.info("Sending access data to computer");

    client.sendMessage(
      MessageAction.INITIALIZE,
      {
        token: computer.authToken,
        code: computer.accessCode,
      }
    );
  }

  public static onAuthenticate(server: SocketServerComputer, client: SocketClient, data: AuthenticatePayload): void {
    if (data.token == undefined) {
      return client.sendError("Missing required data field: token");
    }

    const computer: Computer|undefined = server.getComputerByUUID(data.uuid);
    if (computer === undefined) {
      return client.sendError("Unable to determine existing client");
    }

    if (computer.authToken !== data.token) {
      return client.sendError("Incorrect auth token provided");
    }

    server.addClient(client, computer.uuid);

    Logger.info("Existing computer authenticated");

    client.sendMessage(
      MessageAction.INITIALIZE,
      {
        token: computer.authToken,
        code: computer.accessCode,
      }
    );
  }

  //endregion
}
