import { NUM, REST } from '../regex-helpers';
import { Line } from './line';

/**
 * Definition of an rtcp-fb attribute.
 *
 * Ex: a=rtcp-fb:96 goog-remb
 */
export class RtcpFbLine extends Line {
  payloadType: number;
  feedback: string;

  private static regex: RegExp = new RegExp(`^rtcp-fb:(${NUM}) (${REST})`);

  constructor(payloadType: number, feedback: string) {
    super();
    this.payloadType = payloadType;
    this.feedback = feedback;
  }

  /**
   * Create an RtcpFbLine from the given string.
   *
   * @param line - The line to parse.
   * @returns An RtcpFbLine instance or undefined if parsing failed.
   */
  static fromSdpLine(line: string): RtcpFbLine | undefined {
    if (!RtcpFbLine.regex.test(line)) {
      return undefined;
    }
    const tokens = line.match(RtcpFbLine.regex) as RegExpMatchArray;
    const payloadType = parseInt(tokens[1], 10);
    const feedback = tokens[2];

    return new RtcpFbLine(payloadType, feedback);
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    return `a=rtcp-fb:${this.payloadType} ${this.feedback}`;
  }
}
