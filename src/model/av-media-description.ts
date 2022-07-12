import {
  DirectionLine,
  ExtMapLine,
  FingerprintLine,
  FmtpLine,
  Line,
  MediaDirection,
  MediaLine,
  MidLine,
  RidLine,
  RtcpFbLine,
  RtcpMuxLine,
  RtpMapLine,
  Setup,
  SetupLine,
  SimulcastLine,
} from '../lines';
import { CodecInfo } from './codec-info';
import { MediaDescription } from './media-description';

/**
 * Model a media description with type 'audio' or 'video'.
 */
export class AvMediaDescription extends MediaDescription {
  pts: Array<number> = [];

  extMaps: Array<ExtMapLine> = [];

  rids: Array<RidLine> = [];

  simulcast?: SimulcastLine;

  codecs: Map<number, CodecInfo> = new Map();

  direction?: MediaDirection;

  rtcpMux = false;

  /**
   * Create a MediaInfo instance from a MediaLine.
   *
   * @param mediaLine - The MediaLine to create this MediaInfo from.
   */
  constructor(mediaLine: MediaLine) {
    super(mediaLine.type, mediaLine.port, mediaLine.protocol);
    this.pts = mediaLine.formats.map((fmt) => {
      return parseInt(fmt, 10);
    });
    this.pts.forEach((pt) => this.codecs.set(pt, new CodecInfo(pt)));
  }

  /**
   * @inheritdoc
   */
  toLines(): Array<Line> {
    const lines: Array<Line> = [];
    lines.push(
      new MediaLine(
        this.type,
        this.port,
        this.protocol,
        this.pts.map((pt) => `${pt}`)
      )
    );
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
    if (this.rtcpMux) {
      lines.push(new RtcpMuxLine());
    }
    if (this.content) {
      lines.push(this.content);
    }
    this.extMaps.forEach((extMap) => lines.push(extMap));
    this.rids.forEach((rid) => lines.push(rid));
    if (this.simulcast) {
      lines.push(this.simulcast);
    }
    if (this.direction) {
      lines.push(new DirectionLine(this.direction as MediaDirection));
    }
    this.codecs.forEach((codec) => lines.push(...codec.toLines()));

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
    if (line instanceof DirectionLine) {
      this.direction = line.direction;
      return true;
    }
    if (line instanceof ExtMapLine) {
      this.extMaps.push(line);
      return true;
    }
    if (line instanceof RidLine) {
      this.rids.push(line);
      return true;
    }
    if (line instanceof RtcpMuxLine) {
      this.rtcpMux = true;
      return true;
    }
    if (line instanceof SimulcastLine) {
      this.simulcast = line;
      return true;
    }
    // Lines pertaining to a specific codec
    if (line instanceof RtpMapLine || line instanceof FmtpLine || line instanceof RtcpFbLine) {
      const codec = this.codecs.get(line.payloadType);
      if (!codec) {
        throw new Error(`Error: got line for unknown codec: ${line.toSdpLine()}`);
      }
      codec.addLine(line);
      return true;
    }
    this.otherLines.push(line);
    return true;
  }

  /**
   * Get the CodecInfo associated with the given payload type, if one exists.
   *
   * @param pt - The payload type.
   * @returns The corresponding CodecInfo, or undefined if none was found.
   */
  getCodecByPt(pt: number): CodecInfo | undefined {
    return this.codecs.get(pt);
  }

  /**
   * Remove all references to the given payload type.  This includes removing any secondary codecs
   * that may be associated with this payload type.
   *
   * @param pt - The payload type of the codec to remove.
   */
  removePt(pt: number) {
    const associatedPts = [...this.codecs.values()]
      .filter((ci: CodecInfo) => ci.primaryCodecPt === pt)
      .map((ci: CodecInfo) => ci.pt);
    const allPtsToRemove = [pt, ...associatedPts];
    allPtsToRemove.forEach((ptToRemove: number) => {
      this.codecs.delete(ptToRemove);
    });
    this.pts = this.pts.filter((existingPt) => allPtsToRemove.indexOf(existingPt) === -1);
  }
}
