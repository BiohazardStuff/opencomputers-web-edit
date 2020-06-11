import SocketServerManager from './classes/socket-server-manager';

const webEditServerManager: SocketServerManager = new SocketServerManager();

webEditServerManager.start(8080);
