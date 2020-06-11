import * as crypto from "crypto";

export default class StringUtil {
  public static randomCode(length: number): string {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .slice(0, length)
      .toString("hex")
      .toUpperCase();
  }
}
