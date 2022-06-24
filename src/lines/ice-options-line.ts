import { REST } from '../regex-helpers';
import { Line } from './line';

/**
 * Model the ice-options line from an SDP as defined in https://datatracker.ietf.org/doc/html/rfc8839#section-5.6.
 *
 * @example
 * a=ice-options:trickle
 */
export class IceOptionsLine extends Line {
  options: Array<string>;

  private static regex = new RegExp(`^ice-options:(${REST})$`);

  /**
   * Create an IceOptionsLine from the given values.
   *
   * @param options - The ICE options.
   */
  constructor(options: Array<string>) {
    super();
    this.options = options;
  }

  /**
   * Create an IceOptionsLine from the given string.
   *
   * @param line - The line to parse.
   * @returns An IceOptionsLine instance or undefined if parsing failed.
   */
  static fromSdpLine(line: string): IceOptionsLine | undefined {
    if (!IceOptionsLine.regex.test(line)) {
      return undefined;
    }
    const tokens = line.match(IceOptionsLine.regex) as RegExpMatchArray;
    const options = tokens[1].split(' ');

    return new IceOptionsLine(options);
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    return `a=ice-options:${this.options.join(' ')}`;
  }
}
