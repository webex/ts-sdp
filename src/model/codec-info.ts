import { FmtpLine, Line, RtcpFbLine, RtpMapLine } from '../lines';
import { SdpBlock } from './sdp-block';

/**
 * Model all information related to a specific codec in an SDP.
 */
export class CodecInfo implements SdpBlock {
  pt: number;

  name?: string;

  clockRate?: number;

  encodingParams?: string;

  fmtParams: Array<string> = [];

  feedback: Array<string> = [];

  // If this codec is a 'secondary codec', this field will contain the payload type
  // of its 'primary' codec.
  primaryCodecPt?: number;

  /**
   * Create a CodecInfo from the given values.
   *
   * @param pt - The payload type.
   */
  constructor(pt: number) {
    this.pt = pt;
  }

  /**
   * @inheritdoc
   */
  addLine(line: Line): boolean {
    if (line instanceof RtpMapLine) {
      this.name = line.encodingName;
      this.clockRate = line.clockRate;
      this.encodingParams = line.encodingParams;
      return true;
    }
    if (line instanceof FmtpLine) {
      this.fmtParams.push(line.params);
      if (line.params.indexOf('apt') !== -1) {
        const apt = line.params.split('=')[1];
        this.primaryCodecPt = parseInt(apt, 10);
      }
      return true;
    }
    if (line instanceof RtcpFbLine) {
      this.feedback.push(line.feedback);
      return true;
    }
    return false;
  }

  /**
   * @inheritdoc
   */
  toLines(): Array<Line> {
    const lines = [];
    // First the RtpMap
    lines.push(
      new RtpMapLine(this.pt, this.name as string, this.clockRate as number, this.encodingParams)
    );
    // Now all RtcpFb
    this.feedback.forEach((fb) => {
      lines.push(new RtcpFbLine(this.pt, fb));
    });
    // Now all Fmtp
    this.fmtParams.forEach((fmt) => {
      lines.push(new FmtpLine(this.pt, fmt));
    });

    return lines;
  }
}
