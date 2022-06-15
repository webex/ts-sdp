import { Line } from './line';

/**
 * Ex: a=rtcp-mux
 */
export class RtcpMuxLine extends Line {
  private static regex = new RegExp(`^rtcp-mux$`);
  constructor() {
    super();
  }

  static fromSdpLine(line: string): RtcpMuxLine | undefined {
    if (!RtcpMuxLine.regex.test(line)) {
      return undefined;
    }
    return new RtcpMuxLine();
  }

  toSdpLine(): string {
    return `a=rtcp-mux`;
  }
}
