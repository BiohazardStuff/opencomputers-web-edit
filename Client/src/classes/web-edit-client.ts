export interface DirectoryItem {
  path: string,
  directory: boolean,
}

export type DirectoryPushCallback = (content: DirectoryItem[]) => void;
export type FilePushCallback = (content: string) => void;

export default class WebEditClient {
  private _socketClient: WebSocket;
  private _computerUUID: string;

  private readonly _directoryPushCallbacks: Map<string, DirectoryPushCallback>;
  private readonly _filePushCallbacks: Map<string, FilePushCallback>;

  public onConnected: (client: WebEditClient) => void;
  public onUUIDChanged: (newUUID: string|undefined, oldUUID: string|undefined) => void;

  constructor() {
    this._directoryPushCallbacks = new Map<string, DirectoryPushCallback>();
    this._filePushCallbacks = new Map<string, FilePushCallback>();
  }

  public connect(url: string): void {
    this._socketClient = new WebSocket(url);

    this._socketClient.onopen = WebEditClient.onOpen;
    this._socketClient.onclose = WebEditClient.onClose;

    this._socketClient.onmessage = event => this.onMessage(event);
  }

  public disconnect(): void {
    this._socketClient?.close();
  }

  // region Private Access

  public getUUID(): string|undefined {
    return this._computerUUID;
  }

  public setUUID(uuid: string): void {
    const oldUUID: string|undefined = this._computerUUID;

    this._computerUUID = uuid;

    if (this.onUUIDChanged !== undefined) {
      this.onUUIDChanged(this._computerUUID, oldUUID);
    }
  }

  public isConfirmed(): boolean {
    return this.getUUID() !== undefined;
  }

  // endregion

  // region Callback Handling

  public clearCallbacks() {
    this._directoryPushCallbacks.clear();
    this._filePushCallbacks.clear();
  }

  public registerDirectoryCallback(path: string, callback: DirectoryPushCallback) {
    this._directoryPushCallbacks.set(path, callback);
  }

  public registerFileCallback(path: string, callback: FilePushCallback) {
    this._filePushCallbacks.set(path, callback);
  }

  private static getCallbackFunction(map: Map<string, Function>, path: string): Function|undefined {
    return map.get("*") || map.get(path);
  }

  private static executeCallbackFunction(map: Map<string, Function>, path: string, content: any) {
    const callback: Function|undefined = WebEditClient.getCallbackFunction(map, path);
    if (callback !== undefined) {
      callback(content);
    }
  }

  // endregion

  public sendMessage(action: string, data: any = {}): void {
    if (action !== "check_access_code") {
      if (this.getUUID() === undefined) {
        return WebEditClient.logMessage(`Client attempted to execute ${ action } on an unconfirmed connection`);
      }

      data.uuid = this.getUUID();
    }

    this._socketClient.send(JSON.stringify({
      action,
      data,
    }));
  }

  private static logMessage(message: string): void {
    const logElement: HTMLElement|null = document.getElementById("message-log");
    if (logElement === null) {
      return;
    }

    const messageElement: HTMLParagraphElement = document.createElement("p");
    messageElement.innerHTML = message;

    logElement.append(messageElement);
  }

  private static onOpen(): void {
    console.log("Websocket connection opened");
  }

  private static onClose(): void {
    console.log("Websocket connection closed");
  }

  private onMessage(event: MessageEvent): void {
    const message = JSON.parse(event.data);

    console.log("Websocket message received: ", message);
    WebEditClient.logMessage(event.data);

    const data: any = message.data;

    switch (message.action) {
      case "connected":
        console.log("Received connection confirmation from server");

        if (this.onConnected !== undefined) {
          this.onConnected(this);
        }

        break;
      case "confirm_access_code":
        this.setUUID(data.uuid);

        break;
      case "push_directory":
        WebEditClient.executeCallbackFunction(this._directoryPushCallbacks, data.path, data.content);

        break;
      case "push_file":
        WebEditClient.executeCallbackFunction(this._filePushCallbacks, data.path, data.content);

        break;
      case "error":

        break;
    }
  }
}
