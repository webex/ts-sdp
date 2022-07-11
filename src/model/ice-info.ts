import { CandidateLine, IceOptionsLine, IcePwdLine, IceUfragLine, Line } from '../lines';
import { SdpBlock } from './sdp-block';

/**
 * Model all of the ICE-related information.
 */
export class IceInfo implements SdpBlock {
  ufrag?: IceUfragLine;

  pwd?: IcePwdLine;

  options?: IceOptionsLine;

  candidates: Array<CandidateLine> = [];

  /**
   * @inheritdoc
   */
  addLine(line: Line): boolean {
    if (line instanceof IceUfragLine) {
      this.ufrag = line;
      return true;
    }
    if (line instanceof IcePwdLine) {
      this.pwd = line;
      return true;
    }
    if (line instanceof IceOptionsLine) {
      this.options = line;
      return true;
    }
    if (line instanceof CandidateLine) {
      this.candidates.push(line);
      return true;
    }
    return false;
  }

  /**
   * @inheritdoc
   */
  toLines(): Array<Line> {
    const lines: Array<Line> = [];
    if (this.ufrag) {
      lines.push(this.ufrag);
    }
    if (this.pwd) {
      lines.push(this.pwd);
    }
    if (this.options) {
      lines.push(this.options);
    }
    this.candidates.forEach((candidate) => lines.push(candidate));
    return lines;
  }
}
