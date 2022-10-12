import { NUM, SP } from '../regex-helpers';
import { Line } from './line';

type SsrcGroupSemantics = 'SIM' | 'FID' | 'FEC';

/**
 * Model an SSRC group line as define by https://datatracker.ietf.org/doc/html/rfc5576#section-4.2.
 *
 * @example
 * a=ssrc-group: FID 13579 24680
 */
export class SsrcGroupLine extends Line {
  semantics: SsrcGroupSemantics;

  ssrcs: number[];

  private static regex = new RegExp(`^ssrc-group:(SIM|FID|FEC) ((?:${NUM}${SP}*)+)`);

  /**
   * Create an SsrcGroupLine from the given values.
   *
   * @param semantics - The semantics of this SSRC group.
   * @param ssrcs - The SSRCs in this SSRC group.
   */
  constructor(semantics: SsrcGroupSemantics, ssrcs: number[]) {
    super();
    this.semantics = semantics;
    this.ssrcs = ssrcs;
  }

  /**
   * Create an SsrcGroupLine from the given string.
   *
   * @param line - The line to parse.
   * @returns An SsrcGroupLine instance or undefined if parsing failed.
   */
  static fromSdpLine(line: string): SsrcGroupLine | undefined {
    if (!SsrcGroupLine.regex.test(line)) {
      return undefined;
    }
    const tokens = line.match(SsrcGroupLine.regex) as RegExpMatchArray;
    const semantics = tokens[1];
    const ssrcs = tokens[2].split(' ').map((ssrcStr) => parseInt(ssrcStr, 10));

    return new SsrcGroupLine(semantics as SsrcGroupSemantics, ssrcs);
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    return `a=ssrc-group:${this.semantics} ${this.ssrcs.join(' ')}`;
  }
}
