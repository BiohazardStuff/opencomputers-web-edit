import MessageAction from "../enums/message-action";

export interface PayloadBase {
  action: MessageAction,
  data: any,
}

export interface ConfirmConnectionPayload {
  uuid: string,
}

export interface AuthenticatePayload {
  uuid: string,
  token: string,
}

export interface CheckAccessCodePayload {
  accessCode: string,
}
