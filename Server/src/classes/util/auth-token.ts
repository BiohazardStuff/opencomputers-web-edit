import * as jwt from "jsonwebtoken";

export default class AuthTokenUtil {
  // todo: env
  private static _tokenSecret = "super secret key";

  public static generate(payload: string|object|Buffer): string {
    return jwt.sign(payload, AuthTokenUtil._tokenSecret);
  }

  public static verify(token: string): string|object {
    return jwt.verify(token, AuthTokenUtil._tokenSecret);
  }
}
