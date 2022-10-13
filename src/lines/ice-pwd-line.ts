import { ANY_NON_WS } from '../regex-helpers';
import { Line } from './line';

/**
 * Model the ice-pwd line from an SDP.
 *
 * @example
 * a=ice-pwd:password
 */
export class IcePwdLine extends Line {
  pwd: string;

  private static regex = new RegExp(`^ice-pwd:(${ANY_NON_WS})$`);

  /**
   * Create an IcePwdLine from the given values.
   *
   * @param pwd - The ICE password.
   */
  constructor(pwd: string) {
    super();
    this.pwd = pwd;
  }

  /**
   * Create an IcePwdLine from the given string.
   *
   * @param line - The line to parse.
   * @returns An IcePwdLine instance or undefined if parsing failed.
   */
  static fromSdpLine(line: string): IcePwdLine | undefined {
    if (!IcePwdLine.regex.test(line)) {
      return undefined;
    }
    const tokens = line.match(IcePwdLine.regex) as RegExpMatchArray;
    const pwd = tokens[1];

    return new IcePwdLine(pwd);
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    return `a=ice-pwd:${this.pwd}`;
  }
}
