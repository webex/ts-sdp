import {DirectionLine, MediaDirection} from "./lines/direction-line";
import {FmtpLine} from "./lines/fmtp-line";
import {Line} from "./lines/line";
import {MediaLine, MediaType} from "./lines/media-line";
import {RtcpFbLine} from "./lines/rtcpfb-line";
import {RtpMapLine} from "./lines/rtpmap-line";

/**
 * A grouping of multiple related lines/information within an SDP.
 */
export interface SdpBlock {
    /**
     * Add a parsed line to this block.
     *
     * @param line - The line to add.
     */
    addLine(line: Line): void;

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
    addLine(line: Line): void {
        this.lines.push(line);
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
    //TODO: associated PTs
    
    constructor(pt: number) {
        this.pt = pt;
    }

    addLine(line: Line): void {
        if (line instanceof RtpMapLine) {
            this.name = line.encodingName;
            this.clockRate = line.clockRate;
            this.encodingParams = line.encodingParams;
            return;
        }
        if (line instanceof FmtpLine) {
            this.fmtParams.push(line.params);
        }
        if (line instanceof RtcpFbLine) {
            this.feedback.push(line.feedback);
        }
    }

    toLines(): Array<Line> {
        const lines = [];
        // First the RtpMap
        lines.push(new RtpMapLine(this.pt, this.name as string, this.clockRate as number, this.encodingParams));
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
 * Models all the information present within a media description block.
 */
export class MediaInfo implements SdpBlock {
    type: MediaType;
    port: number;
    protocol: string;
    pts: Array<number> = [];
    codecs: Map<number, CodecInfo> = new Map();
    direction?: MediaDirection;

    constructor(mediaLine: MediaLine) {
        this.type = mediaLine.type;
        this.port = mediaLine.port;
        this.protocol = mediaLine.protocol;
        this.pts = mediaLine.formats.map((fmt) => {
            return parseInt(fmt);
        });
        this.pts.forEach((pt) => this.codecs.set(pt, new CodecInfo(pt)));
    }

    toLines(): Array<Line> {
        const lines: Array<Line> = [];
        lines.push(new MediaLine(this.type, this.port, this.protocol, this.pts.map((pt) => `${pt}`)));
        lines.push(new DirectionLine(this.direction as MediaDirection));
        this.codecs.forEach((codec) => lines.push(...codec.toLines()));

        return lines;
    }

    addLine(line: Line): void {
        if (line instanceof MediaLine) {
            console.log("Error: tried passing a MediaLine to an existing MediaInfo");
            return;
        }
        if (line instanceof DirectionLine) {
            this.direction = line.direction;
        }
        // Lines pertaining to a specific codec
        if (line instanceof RtpMapLine || line instanceof FmtpLine || line instanceof RtcpFbLine) {
            const codec = this.codecs.get(line.payloadType);
            if (!codec) {
                console.log("Error: got line for unknown codec: ", line);
                return;
            }
            codec.addLine(line);
        }
    }
}

/**
 * Models an entire SDP: a session block and 0 or more media blocks
 */
export class Sdp {
    session: SessionInfo = new SessionInfo();
    media: Array<MediaInfo> = [];

    toSdp(): string {
        const lines: Array<Line> = [];
        lines.push(...this.session.toLines());
        this.media.forEach((m) => lines.push(...m.toLines()));

        return lines.map((l) => l.toSdpLine()).join('\r\n');
    }
}
