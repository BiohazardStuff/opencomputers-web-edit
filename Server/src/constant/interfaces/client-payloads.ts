import ClientAction from '../enums/client-action';

export interface PayloadBase {
  action: ClientAction,
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
