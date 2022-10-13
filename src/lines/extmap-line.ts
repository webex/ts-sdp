import { NUM, REST, ANY_NON_WS } from '../regex-helpers';
import { Line } from './line';

/**
 * Model an extmap line from an SDP as defined by https://datatracker.ietf.org/doc/html/rfc5285#section-5.
 *
 * @example
 * a=extmap:1 urn:ietf:params:rtp-hdrext:toffset
 */
export class ExtMapLine extends Line {
  id: number;

  direction?: 'sendonly' | 'recvonly' | 'sendrecv' | 'inactive';

  uri: string;

  extensionAttributes?: string;

  private static EXTMAP_DIRECTION = `sendonly|recvonly|sendrecv|inactive`;

  private static regex = new RegExp(
    `^extmap:(${NUM})(?:/(${this.EXTMAP_DIRECTION}))? (${ANY_NON_WS})(?: (${REST}))?`
  );

  /**
   * Create an ExtMapLine from the given values.
   *
   * @param id - The ID.
   * @param uri - The URI.
   * @param direction - The stream direction.
   * @param extensionAttributes - The attributes of the extension.
   */
  constructor(
    id: number,
    uri: string,
    direction?: 'sendonly' | 'recvonly' | 'sendrecv' | 'inactive',
    extensionAttributes?: string
  ) {
    super();
    this.id = id;
    this.uri = uri;
    this.direction = direction;
    this.extensionAttributes = extensionAttributes;
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
    const direction = tokens[2] as 'sendonly' | 'recvonly' | 'sendrecv' | 'inactive';
    const uri = tokens[3];
    const extensionAttributes = tokens[4];

    return new ExtMapLine(id, uri, direction, extensionAttributes);
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    let str = '';
    str += `a=extmap:${this.id}`;
    if (this.direction) {
      str += `/${this.direction}`;
    }
    str += ` ${this.uri}`;
    if (this.extensionAttributes) {
      str += ` ${this.extensionAttributes}`;
    }
    return str;
  }
}
