import {
  BandwidthLine,
  BundleGroupLine,
  ConnectionLine,
  ContentLine,
  FingerprintLine,
  Line,
  MediaType,
  MidLine,
  Setup,
  SetupLine,
} from '../lines';
import { IceInfo } from './ice-info';
import { SdpBlock } from './sdp-block';

/**
 * All the elements of a media description block that are common to all media types.
 */
export abstract class MediaDescription implements SdpBlock {
  type: MediaType;

  port: number;

  protocol: string;

  mid?: string;

  iceInfo: IceInfo = new IceInfo();

  fingerprint?: string;

  setup?: Setup;

  bandwidth?: BandwidthLine;

  connection?: ConnectionLine;

  content?: ContentLine;

  /**
   * Any line that doesn't have explicit parsing support in the lib
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
   * Find a line amongst 'otherLines' that is of the given type.
   *
   * @param ty - The type of the line to find.
   * @returns The first line found of that instance, or undefined if there are none.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  findOtherLine<T extends Line, U extends new (...args: any[]) => T>(ty: U): T | undefined {
    return this.otherLines.find<T>((line: Line): line is T => line instanceof ty);
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
      return true;
    }
    if (line instanceof MidLine) {
      this.mid = line.mid;
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
    if (line instanceof ConnectionLine) {
      this.connection = line;
      return true;
    }
    if (line instanceof ContentLine) {
      this.content = line;
      return true;
    }

    // If it didn't match anything else, see if IceInfo wants it.
    return this.iceInfo.addLine(line);
  }
}
