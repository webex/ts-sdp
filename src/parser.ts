import { ExtMapLine } from './lines/extmap-line';
import { ConnectionLine } from './lines/connection-line';
import { DirectionLine } from './lines/direction-line';
import { FmtpLine } from './lines/fmtp-line';
import { Line } from './lines/line';
import { MediaLine } from './lines/media-line';
import { OriginLine } from './lines/origin-line';
import { RtcpFbLine } from './lines/rtcpfb-line';
import { RtpMapLine } from './lines/rtpmap-line';
import { VersionLine } from './lines/version-line';
import { ApplicationMediaDescription, MediaDescription, AvMediaDescription, Sdp, SdpBlock } from './model';
import { MidLine } from './lines/mid-line';
import { IceUfragLine } from './lines/ice-ufrag-line';
import { IcePwdLine } from './lines/ice-pwd-line';
import { FingerprintLine } from './lines/fingerprint-line';
import { SetupLine } from './lines/setup-line';
import { SessionNameLine } from './lines/session-name-line';
import { TimingLine } from './lines/timing-line';
import { SctpPortLine } from './lines/sctp-port-line';
import { MaxMessageSizeLine } from './lines/max-message-size-line';
import { RtcpMuxLine } from './lines/rtcp-mux-line';
import { UnknownLine } from './lines/unknown-line';
import {BundleGroupLine} from './lines/bundle-group-line';
import {BandwidthLine} from './lines/bandwidth-line';

export const DEFAULT_SDP_GRAMMAR = {
  v: VersionLine.fromSdpLine,
  o: OriginLine.fromSdpLine,
  c: ConnectionLine.fromSdpLine,
  m: MediaLine.fromSdpLine,
  s: SessionNameLine.fromSdpLine,
  t: TimingLine.fromSdpLine,
  b: BandwidthLine.fromSdpLine,
  a: [
    RtpMapLine.fromSdpLine,
    RtcpFbLine.fromSdpLine,
    FmtpLine.fromSdpLine,
    DirectionLine.fromSdpLine,
    ExtMapLine.fromSdpLine,
    MidLine.fromSdpLine,
    IceUfragLine.fromSdpLine,
    IcePwdLine.fromSdpLine,
    FingerprintLine.fromSdpLine,
    SetupLine.fromSdpLine,
    SctpPortLine.fromSdpLine,
    MaxMessageSizeLine.fromSdpLine,
    RtcpMuxLine.fromSdpLine,
    BundleGroupLine.fromSdpLine
  ],
};

/**
 * Test whether or not the given string appears to be a valid SDP line.
 *
 * @param line - The line to validate.
 * @returns True if the line appears valid, false otherwise.
 */
function isValidLine(line: string): boolean {
  return line.length > 2;
}

/**
 * Convert an array of parsed lines into an Sdp instance.
 *
 * @param lines - The lines to process.
 * @returns An SDP object.
 */
function postProcess(lines: Array<Line>): Sdp {
  const sdp = new Sdp();
  let currBlock: SdpBlock = sdp.session;
  lines.forEach((l) => {
    if (l instanceof MediaLine) {
      let mediaInfo: MediaDescription;
      if (l.type === 'audio' || l.type === 'video') {
        mediaInfo = new AvMediaDescription(l);
      } else if (l.type === 'application') {
        mediaInfo = new ApplicationMediaDescription(l);
      } else {
        console.log(`Unhandled media type: ${l.type}`);
        return;
      }
      sdp.media.push(mediaInfo);
      currBlock = mediaInfo;
    } else {
      currBlock.addLine(l);
    }
  });
  return sdp;
}

/**
 * Parse the given SDP string into an Sdp object.
 *
 * @param sdp - The SDP to parse.
 * @param grammar - An optional SDP grammar map to use when parsing. Defaults to
 * DEFAULT_SDP_GRAMMAR.
 * @returns An Sdp object modeling the given SDP.
 */
export function parse(sdp: string, grammar: any = DEFAULT_SDP_GRAMMAR): Sdp {
  const lines: Array<Line> = [];
  sdp
    .split(/(\r\n|\r|\n)/)
    .filter(isValidLine)
    .forEach((l) => {
      const lineType = l[0];
      const lineValue = l.slice(2);
      const parser = grammar[lineType];
      if (Array.isArray(parser)) {
        // eslint-disable-next-line no-restricted-syntax
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
          return;
        }
      }
      const result = UnknownLine.fromSdpLine(lineValue);
      lines.push(result);
    });
  const parsed = postProcess(lines);
  return parsed;
}
