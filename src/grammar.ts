// Any consecutive string of digits
const NUM = '\\d+';
// Any consecutive non-whitespace token
const TOKEN = '\\S+';
// A single whitespace
const SP = '\\w';
// 0 or more whitespace chars 
const WS = '\\w*';
// The rest of the line
const REST = '.*';

function replacer(key, value) {
  if(value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}

export abstract class Line {
    //abstract toSdpLine(): string;
}

class VersionLine extends Line {
    version: number;
    //private static regex: RegExp = /^(\d*)$/;
    private static regex: RegExp = new RegExp(`^(${NUM})$`);

    constructor(version: number) {
        super();
        this.version = version;
    }

    static fromSdpLine(line: string): VersionLine | undefined {
        if (!VersionLine.regex.test(line)) {
            return undefined;
        }
        const tokens = line.match(VersionLine.regex) as RegExpMatchArray;
        const version = parseInt(tokens[1]);
        return new VersionLine(version);
    }

    toSdpLine(): string {
        return `v=${this.version}`;
    }
}

class OriginLine extends Line {
    username: string;
    sessionId: number;
    sessionVersion: number;
    netType: string;
    addrType: string;
    ipAddr: string;

    //private static regex: RegExp = /^(\S*) (\d*) (\d*) (\S*) (\S*) (\S*)/;
    private static regex: RegExp = new RegExp(`^(${TOKEN}) (${NUM}) (${NUM}) (${TOKEN}) (${TOKEN}) (${TOKEN})`);

    constructor(
            username: string,
            sessionId: number,
            sessionVersion: number,
            netType: string,
            addrType: string,
            ipAddr: string
    ) {
        super();
        this.username = username;
        this.sessionId = sessionId;
        this.sessionVersion = sessionVersion;
        this.netType = netType;
        this.addrType = addrType;
        this.ipAddr = ipAddr;
    }

    static fromSdpLine(line: string): OriginLine | undefined {
        if (!OriginLine.regex.test(line)) {
            return undefined;
        }
        const tokens = line.match(OriginLine.regex) as RegExpMatchArray;
        const username = tokens[1];
        const sessionId = parseInt(tokens[2]);
        const sessionVersion = parseInt(tokens[3]);
        const netType  = tokens[4];
        const addrType = tokens[5];
        const ipAddr = tokens[6];
        return new OriginLine(
            username,
            sessionId,
            sessionVersion,
            netType,
            addrType,
            ipAddr
        );
    }

    toSdpLine(): string {
        return `o=${this.username} ${this.sessionId} ${this.sessionVersion} ${this.netType} ${this.addrType} ${this.ipAddr}`;
    }
}

class ConnectionLine extends Line {
    netType: string;
    addrType: string;
    ipAddr: string;

    private static regex: RegExp = /^(\S*) (\S*) (\S*)/;

    constructor(
            netType: string,
            addrType: string,
            ipAddr: string
    ) {
        super();
        this.netType = netType;
        this.addrType = addrType;
        this.ipAddr = ipAddr;
    }

    static fromSdpLine(line: string): ConnectionLine | undefined {
        if (!ConnectionLine.regex.test(line)) {
            return undefined;
        }
        const tokens = line.match(ConnectionLine.regex) as RegExpMatchArray;
        const netType = tokens[1];
        const addrType = tokens[2];
        const ipAddr = tokens[3];

        return new ConnectionLine(netType, addrType, ipAddr);
    }
}

type MediaType = 'audio' | 'video' | 'application';

function isValidMediaType(value: string): value is MediaType {
    return value === 'audio' || value === 'video' || value === 'application';
}

class MediaLine extends Line {
    type: MediaType;
    port: number;
    protocol: string;
    formats: Array<string>

    private static regex: RegExp = /^(\w*) (\d*) ([\w/]*)(?: (.*))?/;

    constructor(
        type: MediaType,
        port: number,
        protocol: string,
        formats: Array<string>
    ) {
        super();
        this.type = type;
        this.port = port;
        this.protocol = protocol;
        this.formats = formats;
    }

    static fromSdpLine(line: string): MediaLine | undefined {
        if (!MediaLine.regex.test(line)) {
            return undefined;
        }
        const tokens = line.match(MediaLine.regex) as RegExpMatchArray;
        const type = tokens[1];
        if (!isValidMediaType(type)) {
            return undefined;
        }
        const port = parseInt(tokens[2]);
        const protocol = tokens[3];
        const formats = tokens[4].split(' ');
        return new MediaLine(type, port, protocol, formats);
    }
}

class RtpMapLine extends Line {
    payloadType: number;
    encodingName: string;
    clockRate: number;
    encodingParams?: string

    // Note: RtpMap params are separated by a slash ('/').  We can't use a 'TOKEN' to capture 
    // the codec name, since that will capture the slash as well.  Even changing this to a 'lazy' match won't
    // work, because then it won't grab enough.
    // Instead, we define a special 'NON_SLASH_TOKEN' helper here, which matches everything but whitespace and
    // a slash.
    private static NON_SLASH_TOKEN = '[^\\s\/]+';
    private static regex: RegExp = new RegExp(`^rtpmap:(${NUM}) (${this.NON_SLASH_TOKEN})/(${this.NON_SLASH_TOKEN})(?:/(${this.NON_SLASH_TOKEN}))?`);

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

    static fromSdpLine(line: string): RtpMapLine | undefined {
        if (!RtpMapLine.regex.test(line)) {
            return undefined;
        }
        const tokens = line.match(RtpMapLine.regex) as RegExpMatchArray;
        const payloadType = parseInt(tokens[1]);
        const encodingName = tokens[2];
        const clockRate = parseInt(tokens[3]);
        let encodingParams = undefined;
        if (tokens.length === 5) {
            encodingParams = tokens[4];
        } 

        return new RtpMapLine(payloadType, encodingName, clockRate, encodingParams);
    }
}

class RtcpFbLine extends Line {
    payloadType: number;
    feedback: string;

    private static regex: RegExp = new RegExp(`^rtcp-fb:(${NUM}) (${REST})`);

    constructor(payloadType: number, feedback: string) {
        super();
        this.payloadType = payloadType;
        this.feedback = feedback;
    }

    static fromSdpLine(line: string): RtcpFbLine | undefined {
        if (!RtcpFbLine.regex.test(line)) {
            return undefined;
        }
        const tokens = line.match(RtcpFbLine.regex) as RegExpMatchArray;
        const payloadType = parseInt(tokens[1]);
        const feedback = tokens[2];
        
        return new RtcpFbLine(payloadType, feedback);
    }
}

class FmtpLine extends Line {
    payloadType: number;
    params: string;

    private static regex: RegExp = new RegExp(`^fmtp:(${NUM}) (${REST})`);

    constructor(payloadType: number, params: string) {
        super();
        this.payloadType = payloadType;
        this.params = params;
    }

    static fromSdpLine(line: string): FmtpLine | undefined {
        if (!FmtpLine.regex.test(line)) {
            return undefined;
        }
        const tokens = line.match(FmtpLine.regex) as RegExpMatchArray;
        const payloadType = parseInt(tokens[1]);
        const params = tokens[2];
        
        return new FmtpLine(payloadType, params);
    }
}

const grammar = {
    v: VersionLine.fromSdpLine,
    o: OriginLine.fromSdpLine,
    c: ConnectionLine.fromSdpLine,
    m: MediaLine.fromSdpLine,
    a: [
        RtpMapLine.fromSdpLine,
        RtcpFbLine.fromSdpLine,
        FmtpLine.fromSdpLine
    ]
}

function isValidLine(line: string): boolean {
    return line.length > 2;
}

function parse(sdp: string): Array<Line> {
    const lines: Array<Line> = [];
    sdp.split(/(\r\n|\r|\n)/)
      .filter(isValidLine)
      .forEach((l) => {
        const lineType = l[0];
        const lineValue = l.slice(2);
        const parser = grammar[lineType];
        if (Array.isArray(parser)) {
            for (const p of parser) {
                const result = p(lineValue);
                if (result) {
                    lines.push(result);
                    return;
                }
            }
        } else {
            const result = parser(lineValue) as Line;
            if (result) {
                lines.push(result);
            }
        }
      });
    return lines;
}

interface SdpBlock {
    addLine(line: Line): void;
}

class SessionInfo implements SdpBlock {
    lines: Array<Line> = [];

    addLine(line: Line): void {
        this.lines.push(line);
    }
}

class CodecInfo {
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
}

class MediaInfo implements SdpBlock {
    type: MediaType;
    port: number;
    protocol: string;
    pts: Array<number> = [];
    codecs: Map<number, CodecInfo> = new Map();

    constructor(mediaLine: MediaLine) {
        this.type = mediaLine.type;
        this.port = mediaLine.port;
        this.protocol = mediaLine.protocol;
        this.pts = mediaLine.formats.map((fmt) => {
            return parseInt(fmt);
        });
        this.pts.forEach((pt) => this.codecs.set(pt, new CodecInfo(pt)));
    }

    addLine(line: Line): void {
        console.log("adding line to media, codecs is: ", JSON.stringify(this.codecs));
        if (line instanceof MediaLine) {
            // error
        }
        if (line instanceof RtpMapLine) {
            const codec = this.codecs.get(line.payloadType);
            if (!codec) {
                console.log("Error: got rtpmap line for unknown codec: ", line);
                return;
            }
            codec.name = line.encodingName;
            codec.clockRate = line.clockRate;
            codec.encodingParams = line.encodingParams;
            return;
        }
        if (line instanceof FmtpLine) {
            const codec = this.codecs.get(line.payloadType);
            if (!codec) {
                console.log("Error: got fmt line for unknown codec: ", line);
                return;
            }
            codec.fmtParams.push(line.params);
        }
        if (line instanceof RtcpFbLine) {
            const codec = this.codecs.get(line.payloadType);
            if (!codec) {
                console.log("Error: got rtcp-fb line for unknown codec: ", line);
                return;
            }
            codec.feedback.push(line.feedback);
        }
    }
}

class Sdp {
    session: SessionInfo = new SessionInfo();
    media: Array<MediaInfo> = [];
}

function postProcess(lines: Array<Line>) {
    const sdp = new Sdp();
    let currBlock: SdpBlock = sdp.session;
    lines.forEach((l) => {
        console.log(l);
        if (l instanceof MediaLine) {
            const mediaInfo = new MediaInfo(l);
            sdp.media.push(mediaInfo);
            currBlock = mediaInfo;
        } else {
            currBlock.addLine(l);
        }
    });
    console.log("build sdp: ", JSON.stringify(sdp, replacer, 2));
}


const input = `v=1
o=jdoe 1234 1 IN IP4 127.0.0.1
m=video 9 UDP/TLS/RTP/SAVPF 96 97 98 99 100 101 127
a=rtcp-fb:127 goog-remb
a=rtcp-fb:127 transport-cc
a=rtcp-fb:127 ccm fir
a=rtcp-fb:127 nack
a=rtcp-fb:127 nack pli
a=fmtp:127 level-asymmetry-allowed_1;packetization-mode=1;profile-level-id=42001f
`;

const lines = parse(input);
postProcess(lines);


