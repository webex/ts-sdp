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

  static fromSdpLine(line: string): RtcpFbLine | undefined {
    if (!RtcpFbLine.regex.test(line)) {
      return undefined;
    }
    const tokens = line.match(RtcpFbLine.regex) as RegExpMatchArray;
    const payloadType = parseInt(tokens[1]);
    const feedback = tokens[2];

    return new RtcpFbLine(payloadType, feedback);
  }

  toSdpLine(): string {
    return `a=rtcp-fb:${this.payloadType} ${this.feedback}`;
  }
}
