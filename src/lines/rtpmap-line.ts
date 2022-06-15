import { NUM } from '../regex-helpers';
import { Line } from './line';

/**
 * Definition of an rtpmap attribute line as defined in https://datatracker.ietf.org/doc/html/rfc4566#section-6.
 *
 * @example
 * a=rtpmap:96 VP8/90000
 */
export class RtpMapLine extends Line {
  payloadType: number;

  encodingName: string;

  clockRate: number;

  encodingParams?: string;

  // Note: RtpMap params are separated by a slash ('/').  We can't use a 'TOKEN' to capture
  // the codec name, since that will capture the slash as well.  Even changing this to a 'lazy' match won't
  // work, because then it won't grab enough.
  // Instead, we define a special 'NON_SLASH_TOKEN' helper here, which matches everything but whitespace and
  // a slash.
  private static NON_SLASH_TOKEN = '[^\\s/]+';

  private static regex = new RegExp(
    `^rtpmap:(${NUM}) (${this.NON_SLASH_TOKEN})/(${this.NON_SLASH_TOKEN})(?:/(${this.NON_SLASH_TOKEN}))?`
  );

  /**
   * Create an RtpMapLine from the given values.
   *
   * @param payloadType - The payload type.
   * @param encodingName - The encoding name.
   * @param clockRate - The encoding clockrate.
   * @param encodingParams - Optional additional encoding parameters.
   */
  constructor(
    payloadType: number,
    encodingName: string,
    clockRate: number,
    encodingParams?: string
  ) {
    super();
    this.payloadType = payloadType;
    this.encodingName = encodingName;
    this.clockRate = clockRate;
    this.encodingParams = encodingParams;
  }

  /**
   * Create an RtpMapLine from the given string.
   *
   * @param line - The line to parse.
   * @returns An RtpMapLine instance or undefined if parsing failed.
   */
  static fromSdpLine(line: string): RtpMapLine | undefined {
    if (!RtpMapLine.regex.test(line)) {
      return undefined;
    }
    const tokens = line.match(RtpMapLine.regex) as RegExpMatchArray;
    const payloadType = parseInt(tokens[1], 10);
    const encodingName = tokens[2];
    const clockRate = parseInt(tokens[3], 10);
    // encodingParams, if present, will be in index 4
    const { 4: encodingParams } = tokens;

    return new RtpMapLine(payloadType, encodingName, clockRate, encodingParams);
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    let str = '';
    str += `a=rtpmap:${this.payloadType} ${this.encodingName}/${this.clockRate}`;
    if (this.encodingParams) {
      str += `/${this.encodingParams}`;
    }
    return str;
  }
}
