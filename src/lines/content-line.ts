import { REST } from '../regex-helpers';
import { Line } from './line';

/**
 * Model the a=content line of the SDP, as defined in rfc4796.
 *
 * @example
 * a=content:slides
 */
export class ContentLine extends Line {
  values: Array<string>;

  private static regex = new RegExp(`^content:(${REST})$`);

  /**
   * Create a ContentLine from the given values.
   *
   * @param values - Array of content values.
   */
  constructor(values: Array<string>) {
    super();
    this.values = values;
  }

  /**
   * Create a ContentLine from the given string.
   *
   * @param line - The line to parse.
   * @returns A ContentLine instance or undefined if parsing failed.
   */
  static fromSdpLine(line: string): ContentLine | undefined {
    if (!ContentLine.regex.test(line)) {
      return undefined;
    }

    const tokens = line.match(ContentLine.regex) as RegExpMatchArray;
    const values = tokens[1].split(',');

    return new ContentLine(values);
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    return `a=content:${this.values.join(',')}`;
  }
}
