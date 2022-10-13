import { ANY_NON_WS, NUM, SDP_TOKEN } from '../regex-helpers';
import { Line } from './line';

/**
 * Model an SSRC line in SDP as defined by https://datatracker.ietf.org/doc/html/rfc5576#section-4.1.
 *
 * @example
 * a=ssrc:1234567 cname:foo
 */
export class SsrcLine extends Line {
  ssrcId: number;

  attribute: string;

  attributeValue: string | undefined;

  attributeData: string | undefined;

  private static regex = new RegExp(
    `^ssrc:(${NUM}) (${SDP_TOKEN})(?::(${SDP_TOKEN})?(?: (${ANY_NON_WS}))?)?$`
  );

  /**
   * Create an SsrcLine from the given values.
   *
   * @param ssrcId - The SSRC ID.
   * @param attribute - The attribute specific to this SSRC.
   * @param attributeValue - An optional attribute value, if applicable.
   * @param attributeData - Optional attribute data, if applicable.
   */
  constructor(
    ssrcId: number,
    attribute: string,
    attributeValue: string | undefined = undefined,
    attributeData: string | undefined = undefined
  ) {
    super();
    this.ssrcId = ssrcId;
    this.attribute = attribute;
    this.attributeValue = attributeValue;
    this.attributeData = attributeData;
  }

  /**
   * Create an SsrcLine from the given string.
   *
   * @param line - The line to parse.
   * @returns An SsrcLine instance or undefined if parsing failed.
   */
  static fromSdpLine(line: string): SsrcLine | undefined {
    if (!SsrcLine.regex.test(line)) {
      return undefined;
    }
    const tokens = line.match(SsrcLine.regex) as RegExpMatchArray;
    const ssrcId = parseInt(tokens[1], 10);
    const attribute = tokens[2];
    const attributeValue = tokens[3];
    const attributeData = tokens[4];

    return new SsrcLine(ssrcId, attribute, attributeValue, attributeData);
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    let str = `a=ssrc:${this.ssrcId} ${this.attribute}`;
    if (this.attributeValue) {
      str += `:${this.attributeValue}`;
    }
    if (this.attributeData) {
      str += ` ${this.attributeData}`;
    }

    return str;
  }
}
