import {ConnectionLine} from "./lines/connection-line";
import {DirectionLine} from "./lines/direction-line";
import {FmtpLine} from "./lines/fmtp-line";
import {Line} from "./lines/line";
import {MediaLine} from "./lines/media-line";
import {OriginLine} from "./lines/origin-line";
import {RtcpFbLine} from "./lines/rtcpfb-line";
import {RtpMapLine} from "./lines/rtpmap-line";
import {VersionLine} from "./lines/version-line";
import {MediaInfo, Sdp, SdpBlock} from "./model";

function replacer(key:any, value:any) {
  if(value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
  } else {
    return value;
  }
}

export const DEFAULT_SDP_GRAMMAR = {
    v: VersionLine.fromSdpLine,
    o: OriginLine.fromSdpLine,
    c: ConnectionLine.fromSdpLine,
    m: MediaLine.fromSdpLine,
    a: [
        RtpMapLine.fromSdpLine,
        RtcpFbLine.fromSdpLine,
        FmtpLine.fromSdpLine,
        DirectionLine.fromSdpLine
    ]
}

function isValidLine(line: string): boolean {
    return line.length > 2;
}



function postProcess(lines: Array<Line>): Sdp {
    const sdp = new Sdp();
    let currBlock: SdpBlock = sdp.session;
    lines.forEach((l) => {
        if (l instanceof MediaLine) {
            const mediaInfo = new MediaInfo(l);
            sdp.media.push(mediaInfo);
            currBlock = mediaInfo;
        } else {
            currBlock.addLine(l);
        }
    });
    return sdp;
}

export function parse(sdp: string, grammar: any = DEFAULT_SDP_GRAMMAR): Sdp {
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
   const parsed = postProcess(lines);
   return parsed;
}

//const input = `v=1
//o=jdoe 1234 1 IN IP4 127.0.0.1
//m=video 9 UDP/TLS/RTP/SAVPF 127
//a=sendrecv
//a=rtcp-fb:127 goog-remb
//a=rtcp-fb:127 transport-cc
//a=rtcp-fb:127 ccm fir
//a=rtcp-fb:127 nack
//a=rtcp-fb:127 nack pli
//a=rtpmap:127 H264/90000
//a=fmtp:127 level-asymmetry-allowed_1;packetization-mode=1;profile-level-id=42001f
//`;
//
//const lines = parse(input);
//postProcess(lines);


