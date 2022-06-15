import { DirectionLine, MediaDirection } from './lines/direction-line';
import {ExtMapLine} from './lines/extmap-line';
import { FmtpLine } from './lines/fmtp-line';
import {FingerprintLine} from './lines/fingerprint-line';
import {IcePwdLine} from './lines/ice-pwd-line';
import {IceUfragLine} from './lines/ice-ufrag-line';
import { Line } from './lines/line';
import { MediaLine, MediaType } from './lines/media-line';
import {MidLine} from './lines/mid-line';
import { RtcpFbLine } from './lines/rtcpfb-line';
import { RtpMapLine } from './lines/rtpmap-line';
import {Setup, SetupLine} from './lines/setup-line';
import {SctpPortLine} from './lines/sctp-port-line';
import {MaxMessageSizeLine} from './lines/max-message-size-line';
import {RtcpMuxLine} from './lines/rtcp-mux-line';
import {UnknownLine} from './lines/unknown-line';

/**
 * A grouping of multiple related lines/information within an SDP.
 */
export interface SdpBlock {
  /**
   * Add a parsed line to this block.
   *
   * @param line - The line to add.
   * @return True if the line was successfully added by this block, false otherwise.
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
   * @see {@link SdpBlock#addLine}
   */
  addLine(line: Line): boolean {
    this.lines.push(line);
    return true;
  }

  /**
   * @see {@link SdpBlock#toSdpLines}
   */
  toLines(): Array<Line> {
    return this.lines;
  }
}

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

  constructor(pt: number) {
    this.pt = pt;
  }

  addLine(line: Line): boolean {
    if (line instanceof RtpMapLine) {
      this.name = line.encodingName;
      this.clockRate = line.clockRate;
      this.encodingParams = line.encodingParams;
      return true;
    }
    if (line instanceof FmtpLine) {
      this.fmtParams.push(line.params);
      if (line.params.indexOf("apt") !== -1) {
          const apt = line.params.split('=')[1];
          this.primaryCodecPt = parseInt(apt);
      }
      return true;
    }
    if (line instanceof RtcpFbLine) {
      this.feedback.push(line.feedback);
      return true;
    }
    return false;
  }

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
export abstract class BaseMediaInfo implements SdpBlock {
  type: MediaType;
  port: number;
  protocol: string;
  mid?: string;
  iceUfrag?: string;
  icePwd?: string;
  fingerprint?: string;
  setup?: Setup;
  unknownAttributes: Array<UnknownLine> = [];

  constructor(
      type: MediaType,
      port: number,
      protocol: string
  ) {
      this.type = type;
      this.port = port;
      this.protocol = protocol;
  }

  abstract toLines(): Array<Line>;

  addLine(line: Line): boolean {
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
    if (line instanceof UnknownLine) {
        this.unknownAttributes.push(line);
        return true;
    }

    return false;
  }
}

export class ApplicationMediaInfo extends BaseMediaInfo {
  sctpPort?: number;
  maxMessageSize?: number;
  fmts: Array<string> = [];

  constructor(mediaLine: MediaLine) {
    super(mediaLine.type, mediaLine.port, mediaLine.protocol);
    this.fmts = mediaLine.formats;
  }

  toLines(): Array<Line> {
    const lines: Array<Line> = [];
    lines.push(
      new MediaLine(
        this.type,
        this.port,
        this.protocol,
        this.fmts
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
    if (this.sctpPort) {
        lines.push(new SctpPortLine(this.sctpPort as number));
    }
    if (this.maxMessageSize) {
        lines.push(new MaxMessageSizeLine(this.maxMessageSize as number));
    }
    lines.push(...this.unknownAttributes);

    return lines;
  }

  addLine(line: Line): boolean {
    if (super.addLine(line)) {
        return true;
    }
    if (line instanceof MediaLine) {
      console.log('Error: tried passing a MediaLine to an existing MediaInfo');
      return false;
    }
    if (line instanceof SctpPortLine) {
        this.sctpPort = line.port;
        return true;
    }
    if (line instanceof MaxMessageSizeLine) {
        this.maxMessageSize = line.maxMessageSize;
        return true;
    }
    return false;
  }
}

/**
 * Models all the information present within a media description block.
 */
export class MediaInfo extends BaseMediaInfo {
  pts: Array<number> = [];
  extMaps: Array<ExtMapLine> = [];
  codecs: Map<number, CodecInfo> = new Map();
  direction?: MediaDirection;
  rtcpMux: boolean = false;

  constructor(mediaLine: MediaLine) {
    super(mediaLine.type, mediaLine.port, mediaLine.protocol);
    this.pts = mediaLine.formats.map((fmt) => {
      return parseInt(fmt);
    });
    this.pts.forEach((pt) => this.codecs.set(pt, new CodecInfo(pt)));
  }

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

    lines.push(...this.unknownAttributes);

    return lines;
  }

  addLine(line: Line): boolean {
    if (super.addLine(line)) {
        return true;
    }
    if (line instanceof MediaLine) {
      console.log('Error: tried passing a MediaLine to an existing MediaInfo');
      return false;
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
        console.log('Error: got line for unknown codec: ', line);
        return false;
      }
      codec.addLine(line);
      return true;
    }
    return false;
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
          this.codecs.delete(ptToRemove)
      });
      this.pts = this.pts.filter((pt) => allPtsToRemove.indexOf(pt) === -1);
  }
}

/**
 * Models an entire SDP: a session block and 0 or more media blocks
 */
export class Sdp {
  session: SessionInfo = new SessionInfo();
  media: Array<BaseMediaInfo> = [];

  toSdp(): string {
    const lines: Array<Line> = [];
    lines.push(...this.session.toLines());
    this.media.forEach((m) => lines.push(...m.toLines()));

    return lines.map((l) => l.toSdpLine()).join('\r\n');
  }
}
