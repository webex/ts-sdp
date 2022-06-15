import { TOKEN } from '../regex-helpers';
import { Line } from './line';

export class IcePwdLine extends Line {
  pwd: string;

  private static regex = new RegExp(`^ice-pwd:(${TOKEN})$`);

  constructor(pwd: string) {
    super();
    this.pwd = pwd;
  }

  static fromSdpLine(line: string): IcePwdLine | undefined {
    if (!IcePwdLine.regex.test(line)) {
      return undefined;
    }
    const tokens = line.match(IcePwdLine.regex) as RegExpMatchArray;
    const pwd = tokens[1];

    return new IcePwdLine(pwd);
  }

  toSdpLine(): string {
    return `a=ice-pwd:${this.pwd}`;
  }
}
