import { DirectionLine, MediaDirection } from './lines/direction-line';
import { ExtMapLine } from './lines/extmap-line';
import { FmtpLine } from './lines/fmtp-line';
import { FingerprintLine } from './lines/fingerprint-line';
import { IcePwdLine } from './lines/ice-pwd-line';
import { IceUfragLine } from './lines/ice-ufrag-line';
import { Line } from './lines/line';
import { MediaLine, MediaType } from './lines/media-line';
import { MidLine } from './lines/mid-line';
import { RtcpFbLine } from './lines/rtcpfb-line';
import { RtpMapLine } from './lines/rtpmap-line';
import { Setup, SetupLine } from './lines/setup-line';
import { SctpPortLine } from './lines/sctp-port-line';
import { MaxMessageSizeLine } from './lines/max-message-size-line';
import { RtcpMuxLine } from './lines/rtcp-mux-line';
import { BundleGroupLine } from './lines/bundle-group-line';
import { BandwidthLine } from './lines/bandwidth-line';
import { ConnectionLine } from './lines';

/**
 * A grouping of multiple related lines/information within an SDP.
 */
export interface SdpBlock {
  /**
   * Add a parsed line to this block.
   *
   * @param line - The line to add.
   * @returns True if the line was successfully added by this block, false otherwise.
   */
  addLine(line: Line): boolean;

  /**
   * Convert this SdpBlock to an array of Lines.
   *
   * @returns - An array containing all the lines for this block.
   */
  toLines(): Array<Line>;
}

/**
 * The information in the session section of an SDP.
 */
export class SessionInfo implements SdpBlock {
  lines: Array<Line> = [];

  /**
   * @inheritdoc
   */
  addLine(line: Line): boolean {
    this.lines.push(line);
    return true;
  }

  /**
   * @inheritdoc
   */
  toLines(): Array<Line> {
    return this.lines;
  }
}

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

/**
 * All the elements of a media description block that are common to all media types.
 */
export abstract class MediaDescription implements SdpBlock {
  type: MediaType;

  port: number;

  protocol: string;

  mid?: string;

  iceUfrag?: string;

  icePwd?: string;

  fingerprint?: string;

  setup?: Setup;

  bandwidth?: BandwidthLine;

  /**
   * Any line that doesn't have explict parsing support in the lib
   * (which includes both lines that fall through and are parsed as
   * 'UnknownLine's, as well as any types that the user has extended
   * the grammar with) will be held here.  When serializing, they are
   * added to the end of the block.
   */
  otherLines: Array<Line> = [];

  /**
   * Create a BaseMediaInfo with the given values.
   *
   * @param type - The MediaType of this MediaInfo.
   * @param port - The port.
   * @param protocol - The protocol.
   */
  constructor(type: MediaType, port: number, protocol: string) {
    this.type = type;
    this.port = port;
    this.protocol = protocol;
  }

  /**
   * @inheritdoc
   */
  abstract toLines(): Array<Line>;

  /**
   * Find a line amongst 'otherLines' that has the given type, if any.
   *
   * @param cls - The type being searched for.
   * @returns The line in 'otherLines' matching that type, or undefined if none
   * was found.
   */
  findLine<T extends Line>(cls: new (...a: any) => T): T | undefined {
    return this.otherLines.find((l): l is T => l instanceof cls);
  }

  /**
   * If a line with the given type is found in 'otherLines', invoke the given callback with it.
   * @param cls - The type being searched for.
   * @param callback - The callback to invoke with the type, if it's found.
   */
  ifHaveLine<T extends Line>(cls: new (...a: any) => T, callback: (line: T) => void): void {
    const line = this.findLine(cls);
    if (line) {
      callback(line);
    }
  }

  /**
   * @inheritdoc
   */
  addLine(line: Line): boolean {
    if (line instanceof BundleGroupLine) {
      throw new Error(`Error: bundle group line not allowed in media description`);
    }
    if (line instanceof BandwidthLine) {
      this.bandwidth = line;
    }
    if (line instanceof MidLine) {
      this.mid = line.mid;
      return true;
    }
    if (line instanceof IceUfragLine) {
      this.iceUfrag = line.ufrag;
      return true;
    }
    if (line instanceof IcePwdLine) {
      this.icePwd = line.pwd;
      return true;
    }
    if (line instanceof FingerprintLine) {
      this.fingerprint = line.fingerprint;
      return true;
    }
    if (line instanceof SetupLine) {
      this.setup = line.setup;
      return true;
    }

    return false;
  }
}

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
    if (this.iceUfrag) {
      lines.push(new IceUfragLine(this.iceUfrag as string));
    }
    if (this.icePwd) {
      lines.push(new IcePwdLine(this.icePwd as string));
    }
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
/**
 * Model a media description with type 'audio' or 'video'.
 */
export class AvMediaDescription extends MediaDescription {
  pts: Array<number> = [];

  extMaps: Array<ExtMapLine> = [];

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
    if (this.iceUfrag) {
      lines.push(new IceUfragLine(this.iceUfrag as string));
    }
    if (this.icePwd) {
      lines.push(new IcePwdLine(this.icePwd as string));
    }
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
    this.extMaps.forEach((extMap) => lines.push(extMap));
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
    if (line instanceof RtcpMuxLine) {
      this.rtcpMux = true;
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

/**
 * Models an entire SDP: a session block and 0 or more media blocks.
 */
export class Sdp {
  session: SessionInfo = new SessionInfo();

  media: Array<MediaDescription> = [];

  /**
   * A helper property to retrieve just audio/video media info blocks.
   */
  get avMedia() {
    return this.media.filter<AvMediaDescription>(
      (mi: MediaDescription): mi is AvMediaDescription => mi instanceof AvMediaDescription
    );
  }

  /**
   * Convert this Sdp object to an SDP string.
   *
   * @returns This SDP as a string.
   */
  toSdp(): string {
    const lines: Array<Line> = [];
    lines.push(...this.session.toLines());
    this.media.forEach((m) => lines.push(...m.toLines()));

    return lines.map((l) => l.toSdpLine()).join('\r\n');
  }
}
