import StringUtil from "../util/string";
import AuthTokenUtil from "../util/auth-token";

export default class Computer {
  public readonly accessCode: string;
  public readonly authToken: string;

  constructor(public readonly uuid: string, accessCode?: string) {
    this.accessCode = accessCode || StringUtil.randomCode(6);

    this.authToken = AuthTokenUtil.generate({
      uuid: this.uuid,
      accessCode: this.accessCode,
    });
  }
}
