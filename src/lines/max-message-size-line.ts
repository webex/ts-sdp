import { NUM } from '../regex-helpers';
import { Line } from './line';

export class MaxMessageSizeLine extends Line {
  maxMessageSize: number;

  private static regex = new RegExp(`^max-message-size:(${NUM})`);

  constructor(maxMessageSize: number) {
    super();
    this.maxMessageSize = maxMessageSize;
  }

  /**
   * Create a MaxMessageSizeLine from the given string.
   *
   * @param line - The line to parse.
   * @returns A MaxMessageSizeLine instance or undefined if parsing failed.
   */
  static fromSdpLine(line: string): MaxMessageSizeLine | undefined {
    if (!MaxMessageSizeLine.regex.test(line)) {
      return undefined;
    }
    const tokens = line.match(MaxMessageSizeLine.regex) as RegExpMatchArray;
    const maxMessageSize = parseInt(tokens[1], 10);

    return new MaxMessageSizeLine(maxMessageSize);
  }

  /**
   * @see {@link Line#toSdpLine
   */
  toSdpLine(): string {
    return `a=max-message-size:${this.maxMessageSize}`;
  }
}
