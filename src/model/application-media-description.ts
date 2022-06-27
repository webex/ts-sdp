import {
  FingerprintLine,
  Line,
  MaxMessageSizeLine,
  MediaLine,
  MidLine,
  SctpPortLine,
  Setup,
  SetupLine,
} from '../lines';
import { MediaDescription } from './media-description';

/**
 * Model a media description with type 'application'.
 */
export class ApplicationMediaDescription extends MediaDescription {
  sctpPort?: number;

  maxMessageSize?: number;

  fmts: Array<string> = [];

  /**
   * Create a new ApplicationMediaInfo from the given MediaLine.
   *
   * @param mediaLine - The MediaLine from which to create this ApplicationMediaInfo.
   */
  constructor(mediaLine: MediaLine) {
    super(mediaLine.type, mediaLine.port, mediaLine.protocol);
    this.fmts = mediaLine.formats;
  }

  /**
   * @inheritdoc
   */
  toLines(): Array<Line> {
    const lines: Array<Line> = [];
    lines.push(new MediaLine(this.type, this.port, this.protocol, this.fmts));
    if (this.connection) {
      lines.push(this.connection);
    }
    if (this.bandwidth) {
      lines.push(this.bandwidth);
    }
    lines.push(...this.iceInfo.toLines());
    if (this.fingerprint) {
      lines.push(new FingerprintLine(this.fingerprint as string));
    }
    if (this.setup) {
      lines.push(new SetupLine(this.setup as Setup));
    }
    if (this.mid) {
      lines.push(new MidLine(this.mid));
    }
    if (this.sctpPort) {
      lines.push(new SctpPortLine(this.sctpPort as number));
    }
    if (this.maxMessageSize) {
      lines.push(new MaxMessageSizeLine(this.maxMessageSize as number));
    }
    lines.push(...this.otherLines);

    return lines;
  }

  /**
   * @inheritdoc
   */
  addLine(line: Line): boolean {
    if (super.addLine(line)) {
      return true;
    }
    if (line instanceof MediaLine) {
      throw new Error('Error: tried passing a MediaLine to an existing MediaInfo');
    }
    if (line instanceof SctpPortLine) {
      this.sctpPort = line.port;
      return true;
    }
    if (line instanceof MaxMessageSizeLine) {
      this.maxMessageSize = line.maxMessageSize;
      return true;
    }
    this.otherLines.push(line);
    return true;
  }
}
