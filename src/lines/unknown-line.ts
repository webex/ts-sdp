import { REST } from '../regex-helpers';
import { Line } from './line';

/**
 * Models any line which the grammar fails to parse.
 */
export class UnknownLine extends Line {
  value: string;

  private static regex = new RegExp(`(${REST})`);

  /**
   * Create a new UnknownLine instance from the given values.
   *
   * @param value - The line's value (besides the <type>=).
   */
  constructor(value: string) {
    super();
    this.value = value;
  }

  /**
   * Create an UnknownLine from the given string.
   *
   * @param line - The line to parse.
   * @returns A UnknownLine instance (parsing shoudl always succeed).
   */
  static fromSdpLine(line: string): UnknownLine {
    const tokens = line.match(UnknownLine.regex) as RegExpMatchArray;

    const value = tokens[1];

    return new UnknownLine(value);
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    return `a=${this.value}`;
  }
}
