class WebEditClient {
  private _socketClient: WebSocket;

  public computerUUID: string;

  constructor() {}

  public connect(url: string): void {
    this._socketClient = new WebSocket(url);

    this._socketClient.onopen = WebEditClient.onOpen;
    this._socketClient.onclose = WebEditClient.onClose;

    this._socketClient.onmessage = event => this.onMessage(event);
  }

  public sendMessage(action: string, data: object = {}, success: boolean = true): void {
    this._socketClient.send(JSON.stringify({
      action,
      data,
      success,
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

    switch (message.action) {
      case "connected":
        console.log("Received connection confirmation from server");

        break;
      case "confirm_access_code":
        const uuidElement: HTMLElement|null = document.getElementById("computer-uuid");
        if (uuidElement === null) {
          break;
        }

        this.computerUUID = message.data.uuid;
        uuidElement.innerHTML = message.data.uuid;

        break;
      case "error":

        break;
    }
  }
}
