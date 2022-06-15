import { Line } from './line';

/**
 * Models an rtcp-mux attribute.
 *
 * @example
 * a=rtcp-mux
 */
export class RtcpMuxLine extends Line {
  private static regex = /^rtcp-mux$/;

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
  // eslint-disable-next-line class-methods-use-this
  toSdpLine(): string {
    return `a=rtcp-mux`;
  }
}
