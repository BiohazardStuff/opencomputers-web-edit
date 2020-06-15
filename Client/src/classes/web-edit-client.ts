export default class WebEditClient {
  private _socketClient: WebSocket;
  private _computerUUID: string;

  public onUUIDChanged: (newUUID: string|undefined, oldUUID: string|undefined) => void;

  public connect(url: string): void {
    this._socketClient = new WebSocket(url);

    this._socketClient.onopen = WebEditClient.onOpen;
    this._socketClient.onclose = WebEditClient.onClose;

    this._socketClient.onmessage = event => this.onMessage(event);
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

        break;
      case "confirm_access_code":
        this.setUUID(data.uuid);

        break;
      case "push_file":
        const fileContentElement: HTMLElement|null = document.getElementById("file-content");
        if (fileContentElement === null) {
          return;
        }

        const fileContentTextarea: HTMLTextAreaElement = fileContentElement as HTMLTextAreaElement;
        fileContentTextarea.value = data.content;

        break;
      case "error":

        break;
    }
  }
}
