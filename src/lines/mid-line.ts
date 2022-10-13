import { ANY_NON_WS } from '../regex-helpers';
import { Line } from './line';

/**
 * Models a mid line.
 *
 * @example
 * a=mid:1
 */
export class MidLine extends Line {
  mid: string;

  private static regex = new RegExp(`^mid:(${ANY_NON_WS})$`);

  /**
   * Create a MidLine from the given values.
   *
   * @param mid - The MID.
   */
  constructor(mid: string) {
    super();
    this.mid = mid;
  }

  /**
   * Create a MidLine from the given string.
   *
   * @param line - The line to parse.
   * @returns A MidLine instance or undefined if parsing failed.
   */
  static fromSdpLine(line: string): MidLine | undefined {
    if (!MidLine.regex.test(line)) {
      return undefined;
    }
    const tokens = line.match(MidLine.regex) as RegExpMatchArray;
    const mid = tokens[1];

    return new MidLine(mid);
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    return `a=mid:${this.mid}`;
  }
}
