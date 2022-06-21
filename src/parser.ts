/* eslint-disable max-classes-per-file */
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
import {
  ApplicationMediaDescription,
  MediaDescription,
  AvMediaDescription,
  Sdp,
  SdpBlock,
} from './model';
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
import { BundleGroupLine } from './lines/bundle-group-line';
import { BandwidthLine } from './lines/bandwidth-line';
import { SessionInformationLine } from './lines/session-information-line';

type Parser = (line: string) => Line | undefined;
type LineType =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z';

/**
 * Defines a grammar interface, which supports adding and retrieving parsers
 * for line types.
 */
export class Grammar {
  parsers: Map<LineType, Parser[]> = new Map();

  /**
   * Add a parser for the given LineType.  Parsers will be attempted
   * in the order in which they're added.
   *
   * @param lineType - The LineType this parser should be used for.
   * @param parser - The parser.
   */
  addParser(lineType: LineType, parser: Parser) {
    const parsers = this.parsers.get(lineType) || [];
    parsers.push(parser);
    this.parsers.set(lineType, parsers);
  }

  /**
   * Get all existing parsers for the given LineType.
   *
   * @param lineType - The LineType.
   * @returns The Parsers for that LineType.
   */
  getParsers(lineType: LineType): Parser[] {
    return this.parsers.get(lineType) || [];
  }
}

/**
 * An extension of the Grammar class which adds the appropriate Parsers
 * for parsing an SDP.
 */
class SdpGrammar extends Grammar {
  /**
   * Create an SdpGrammar instance.
   */
  constructor() {
    super();
    this.addParser('v', VersionLine.fromSdpLine);
    this.addParser('o', OriginLine.fromSdpLine);
    this.addParser('c', ConnectionLine.fromSdpLine);
    this.addParser('i', SessionInformationLine.fromSdpLine);
    this.addParser('m', MediaLine.fromSdpLine);
    this.addParser('s', SessionNameLine.fromSdpLine);
    this.addParser('t', TimingLine.fromSdpLine);
    this.addParser('b', BandwidthLine.fromSdpLine);
    this.addParser('a', RtpMapLine.fromSdpLine);
    this.addParser('a', RtcpFbLine.fromSdpLine);
    this.addParser('a', FmtpLine.fromSdpLine);
    this.addParser('a', DirectionLine.fromSdpLine);
    this.addParser('a', ExtMapLine.fromSdpLine);
    this.addParser('a', MidLine.fromSdpLine);
    this.addParser('a', IceUfragLine.fromSdpLine);
    this.addParser('a', IcePwdLine.fromSdpLine);
    this.addParser('a', FingerprintLine.fromSdpLine);
    this.addParser('a', SetupLine.fromSdpLine);
    this.addParser('a', SctpPortLine.fromSdpLine);
    this.addParser('a', MaxMessageSizeLine.fromSdpLine);
    this.addParser('a', RtcpMuxLine.fromSdpLine);
    this.addParser('a', BundleGroupLine.fromSdpLine);
  }
}

export const DefaultSdpGrammar = new SdpGrammar();

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
        throw new Error(`Unhandled media type: ${l.type}`);
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
export function parse(sdp: string, grammar: Grammar = DefaultSdpGrammar): Sdp {
  const lines: Array<Line> = [];
  sdp
    .split(/(\r\n|\r|\n)/)
    .filter(isValidLine)
    .forEach((l) => {
      const lineType = l[0];
      const lineValue = l.slice(2);
      const parsers = grammar.getParsers(lineType as LineType);
      // eslint-disable-next-line no-restricted-syntax
      for (const parser of parsers) {
        const result = parser(lineValue);
        if (result) {
          lines.push(result);
          return;
        }
      }

      // When parsing an unknown line, we need to preserve the line type as well, so
      // pass the entire line in here.
      const result = UnknownLine.fromSdpLine(l);
      lines.push(result);
    });
  const parsed = postProcess(lines);
  return parsed;
}
