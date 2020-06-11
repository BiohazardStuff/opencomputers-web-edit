import SocketServer from './socket-server';
import ClientAction from '../../constant/enums/client-action';
import SocketServerManager from '../socket-server-manager';
import Web from '../../modules/web';

export default class SocketServerWeb extends SocketServer {
  constructor(parent: SocketServerManager) {
    super(parent);

    this.registerEventHandler(ClientAction.CHECK_ACCESS_CODE, Web.onCheckAccessCode);
  }
}
