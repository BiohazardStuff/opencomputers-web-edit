import { CheckAccessCodePayload } from '../constant/interfaces/client-payloads';
import SocketClient from '../classes/socket-client';
import Logger from '../classes/logger';
import SocketServerWeb from '../classes/socket-server/socket-server-web';

export default class Web {
  public static onCheckAccessCode(server: SocketServerWeb, client: SocketClient, data: CheckAccessCodePayload) {
    Logger.info(`Client checking with access code ${data.accessCode}`);
  }
}
