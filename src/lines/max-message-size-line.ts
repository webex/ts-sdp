import { NUM } from '../regex-helpers';
import { Line } from './line';

export class MaxMessageSizeLine extends Line {
  maxMessageSize: number;

  private static regex = new RegExp(`^max-message-size:(${NUM})`);

  constructor(maxMessageSize: number) {
    super();
    this.maxMessageSize = maxMessageSize;
  }

  static fromSdpLine(line: string): MaxMessageSizeLine | undefined {
    if (!MaxMessageSizeLine.regex.test(line)) {
      return undefined;
    }
    const tokens = line.match(MaxMessageSizeLine.regex) as RegExpMatchArray;
    const maxMessageSize = parseInt(tokens[1]);

    return new MaxMessageSizeLine(maxMessageSize);
  }

  toSdpLine(): string {
    return `a=max-message-size:${this.maxMessageSize}`;
  }
}
