import { NUM } from '../regex-helpers';
import { Line } from './line';

export class SctpPortLine extends Line {
  port: number;

  private static regex = new RegExp(`^sctp-port:(${NUM})`);

  constructor(port: number) {
    super();
    this.port = port;
  }

  /**
   * Create a SctpPortLine from the given string.
   *
   * @param line - The line to parse.
   * @returns A SctpPortLine instance or undefined if parsing failed.
   */
  static fromSdpLine(line: string): SctpPortLine | undefined {
    if (!SctpPortLine.regex.test(line)) {
      return undefined;
    }
    const tokens = line.match(SctpPortLine.regex) as RegExpMatchArray;
    const port = parseInt(tokens[1]);

    return new SctpPortLine(port);
  }

  /**
   * @see {@link Line#toSdpLine
   */
  toSdpLine(): string {
    return `a=sctp-port:${this.port}`;
  }
}
