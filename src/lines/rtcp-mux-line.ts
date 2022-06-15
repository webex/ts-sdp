import { Line } from './line';

/**
 * Ex: a=rtcp-mux
 */
export class RtcpMuxLine extends Line {
  private static regex = new RegExp(`^rtcp-mux$`);
  constructor() {
    super();
  }

  /**
   * Create an RtcpMuxLine from the given string.
   *
   * @param line - The line to parse.
   * @returns An RtcpMuxLine instance or undefined if parsing failed.
   */
  static fromSdpLine(line: string): RtcpMuxLine | undefined {
    if (!RtcpMuxLine.regex.test(line)) {
      return undefined;
    }
    return new RtcpMuxLine();
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    return `a=rtcp-mux`;
  }
}
