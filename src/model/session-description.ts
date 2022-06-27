import {
  BandwidthLine,
  BundleGroupLine,
  ConnectionLine,
  Line,
  OriginLine,
  SessionInformationLine,
  SessionNameLine,
  TimingLine,
  VersionLine,
} from '../lines';
import { SdpBlock } from './sdp-block';

/**
 * The information in the session section of an SDP.
 */
export class SessionDescription implements SdpBlock {
  version?: VersionLine;

  origin?: OriginLine;

  sessionName?: SessionNameLine;

  information?: SessionInformationLine;

  connection?: ConnectionLine;

  timing?: TimingLine;

  bandwidth?: BandwidthLine;

  groups: Array<BundleGroupLine> = [];

  /**
   * Any line that doesn't have explicit parsing support in the lib
   * (which includes both lines that fall through and are parsed as
   * 'UnknownLine's, as well as any types that the user has extended
   * the grammar with) will be held here.  When serializing, they are
   * added to the end of the block.
   */
  otherLines: Array<Line> = [];

  /**
   * @inheritdoc
   */
  addLine(line: Line): boolean {
    if (line instanceof VersionLine) {
      this.version = line;
      return true;
    }
    if (line instanceof OriginLine) {
      this.origin = line;
      return true;
    }
    if (line instanceof SessionNameLine) {
      this.sessionName = line;
      return true;
    }
    if (line instanceof SessionInformationLine) {
      this.information = line;
      return true;
    }
    if (line instanceof TimingLine) {
      this.timing = line;
      return true;
    }
    if (line instanceof ConnectionLine) {
      this.connection = line;
      return true;
    }
    if (line instanceof BandwidthLine) {
      this.bandwidth = line;
      return true;
    }
    if (line instanceof BundleGroupLine) {
      this.groups.push(line);
      return true;
    }
    this.otherLines.push(line);
    return true;
  }

  /**
   * @inheritdoc
   */
  toLines(): Array<Line> {
    const lines: Array<Line> = [];
    if (this.version) {
      lines.push(this.version);
    }
    if (this.origin) {
      lines.push(this.origin);
    }
    if (this.sessionName) {
      lines.push(this.sessionName);
    }
    if (this.information) {
      lines.push(this.information);
    }
    if (this.connection) {
      lines.push(this.connection);
    }
    if (this.bandwidth) {
      lines.push(this.bandwidth);
    }
    if (this.timing) {
      lines.push(this.timing);
    }
    if (this.groups) {
      lines.push(...this.groups);
    }
    lines.push(...this.otherLines);
    return lines;
  }
}
