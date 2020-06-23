import * as dotenv from "dotenv";

import SocketServerManager from './classes/socket-server-manager';

dotenv.config();

const webEditServerManager: SocketServerManager = new SocketServerManager();

webEditServerManager.start(8080);
