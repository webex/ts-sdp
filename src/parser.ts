/* eslint-disable max-classes-per-file */
import { IceOptionsLine } from './lines';
import { BandwidthLine } from './lines/bandwidth-line';
import { BundleGroupLine } from './lines/bundle-group-line';
import { CandidateLine } from './lines/candidate-line';
import { ConnectionLine } from './lines/connection-line';
import { ContentLine } from './lines/content-line';
import { DirectionLine } from './lines/direction-line';
import { ExtMapLine } from './lines/extmap-line';
import { FingerprintLine } from './lines/fingerprint-line';
import { FmtpLine } from './lines/fmtp-line';
import { IcePwdLine } from './lines/ice-pwd-line';
import { IceUfragLine } from './lines/ice-ufrag-line';
import { Line } from './lines/line';
import { MaxMessageSizeLine } from './lines/max-message-size-line';
import { MediaLine } from './lines/media-line';
import { MidLine } from './lines/mid-line';
import { OriginLine } from './lines/origin-line';
import { RidLine } from './lines/rid-line';
import { RtcpMuxLine } from './lines/rtcp-mux-line';
import { RtcpFbLine } from './lines/rtcpfb-line';
import { RtpMapLine } from './lines/rtpmap-line';
import { SctpPortLine } from './lines/sctp-port-line';
import { SessionInformationLine } from './lines/session-information-line';
import { SessionNameLine } from './lines/session-name-line';
import { SetupLine } from './lines/setup-line';
import { SimulcastLine } from './lines/simulcast-line';
import { TimingLine } from './lines/timing-line';
import { UnknownLine } from './lines/unknown-line';
import { VersionLine } from './lines/version-line';
import {
  ApplicationMediaDescription,
  AvMediaDescription,
  MediaDescription,
  Sdp,
  SdpBlock,
} from './model';

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
    this.addParser('a', IceOptionsLine.fromSdpLine);
    this.addParser('a', FingerprintLine.fromSdpLine);
    this.addParser('a', SetupLine.fromSdpLine);
    this.addParser('a', SctpPortLine.fromSdpLine);
    this.addParser('a', MaxMessageSizeLine.fromSdpLine);
    this.addParser('a', RtcpMuxLine.fromSdpLine);
    this.addParser('a', BundleGroupLine.fromSdpLine);
    this.addParser('a', ContentLine.fromSdpLine);
    this.addParser('a', RidLine.fromSdpLine);
    this.addParser('a', CandidateLine.fromSdpLine);
    this.addParser('a', SimulcastLine.fromSdpLine);
    this.addParser('a', RidLine.fromSdpLine);
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
export function parseToModel(lines: Array<Line>): Sdp {
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
 * Parse the given SDP string into an array of Line instances.
 *
 * @param sdp - The SDP to parse.
 * @param grammar - The Grammar instance to use for parsing.
 * @returns - An array of Line instances representing the given SDP.
 */
export function parseToLines(sdp: string, grammar: Grammar): Array<Line> {
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
  return lines;
}

/**
 * Parse the given SDP string into an Sdp object.
 *
 * @param sdp - The SDP to parse.
 * @param grammar - An optional Grammar instance to use when parsing. Defaults to
 * DefaultSdpGrammar.
 * @returns An Sdp object modeling the given SDP.
 */
export function parse(sdp: string, grammar: Grammar = DefaultSdpGrammar): Sdp {
  const lines: Array<Line> = parseToLines(sdp, grammar);
  const parsed = parseToModel(lines);
  return parsed;
}
