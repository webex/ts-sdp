import { NUM, REST } from '../regex-helpers';
import { Line } from './line';

/**
 * Model an extmap line from an SDP as defined by https://datatracker.ietf.org/doc/html/rfc5285#section-5.
 *
 * @example
 * a=extmap:1 urn:ietf:params:rtp-hdrext:toffset
 */
export class ExtMapLine extends Line {
  id: number;

  uri: string;

  private static regex = new RegExp(`^extmap:(${NUM}) (${REST})`);

  /**
   * Create an ExtMapLine from the given values.
   *
   * @param id - The ID.
   * @param uri - The URI.
   */
  constructor(id: number, uri: string) {
    super();
    this.id = id;
    this.uri = uri;
  }

  /**
   * Create an ExtMapLine from the given string.
   *
   * @param line - The line to parse.
   * @returns An ExtMapLine instance or undefined if parsing failed.
   */
  static fromSdpLine(line: string): ExtMapLine | undefined {
    if (!ExtMapLine.regex.test(line)) {
      return undefined;
    }
    const tokens = line.match(ExtMapLine.regex) as RegExpMatchArray;
    const id = parseInt(tokens[1], 10);
    const uri = tokens[2];

    return new ExtMapLine(id, uri);
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    return `a=extmap:${this.id} ${this.uri}`;
  }
}
