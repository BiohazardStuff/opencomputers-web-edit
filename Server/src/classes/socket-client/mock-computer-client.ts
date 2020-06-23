import * as fs from "fs";
import * as path from "path";

import MessageAction from "../../constant/enums/message-action";
import ErrorCode from "../../constant/enums/error-code";
import SocketClient from "./socket-client";
import SocketServer from "../socket-server/socket-server";
import Computer from "../container/computer";

interface DirectoryItem {
  path: string,
  directory: boolean,
}

interface DirectoryTree {
  [key: string]: DirectoryItem[]|undefined,
}

interface FileTree {
  [key: string]: string|undefined,
}

interface MockData {
  directoryTree: DirectoryTree
  fileTree: FileTree
}

export default class MockComputerClient implements SocketClient {
  private readonly _directoryTree: DirectoryTree;
  private readonly _fileTree: FileTree;

  constructor(private readonly _server: SocketServer, private readonly _computer: Computer) {
    const mockDataPath: string = path.join(__dirname, "..", "..", "mock-data", "mock-socket-client.json");
    const rawMockData: string = fs.readFileSync(mockDataPath).toString();

    const mockData: MockData = JSON.parse(rawMockData);

    this._directoryTree = mockData.directoryTree;
    this._fileTree = mockData.fileTree;
  }

  public sendMessage(action: MessageAction, data: any = {}): void {
    console.log(`Mock client sending message ${ action }`);

    switch (action) {
      case MessageAction.PULL_DIRECTORY:
        this.pushDirectory(data.path);

        break;
      case MessageAction.PULL_FILE:
        this.pushFile(data.path);

        break;
    }
  }

  public sendError(message: string, code: number = ErrorCode.GENERAL): void {
    console.log("Mock client sending error");
  }

  private emulateMessage(action: MessageAction, data: any): void {
    this._server.emulateMessage(this, {
      action,
      data: {
        uuid: this._computer.uuid,
        ...data
      }
    });
  }

  private emulateError(message: string, code: number = ErrorCode.GENERAL): void {
    this.emulateMessage(
      MessageAction.ERROR,
      {
        message,
        code,
      }
    )
  }

  private pushDirectory(path: string): void {
    const directoryItems: DirectoryItem[]|undefined = this._directoryTree[path];
    if (directoryItems === undefined) {
      return this.emulateError("Invalid directory provided");
    }

    this.emulateMessage(
      MessageAction.PUSH_DIRECTORY,
      {
        directory: directoryItems,
      }
    );
  }

  private pushFile(path: string): void {
    const fileContent: string|undefined = this._fileTree[path];
    if (fileContent === undefined) {
      return this.emulateError("Invalid file path provided");
    }

    this.emulateMessage(
      MessageAction.PUSH_FILE,
      {
        content: fileContent,
      }
    )
  }
}
