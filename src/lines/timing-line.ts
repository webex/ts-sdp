import { NUM } from '../regex-helpers';
import { Line } from './line';

/**
 * Timing as defined by https://datatracker.ietf.org/doc/html/rfc4566#section-5.9.
 *
 * @example
 * t=0 0
 */
export class TimingLine extends Line {
  startTime: number;

  stopTime: number;

  private static regex = new RegExp(`^(${NUM}) (${NUM})`);

  /**
   * Create a new TimingLine from the given values.
   *
   * @param startTime - The start time.
   * @param stopTime - The stop time.
   */
  constructor(startTime: number, stopTime: number) {
    super();
    this.startTime = startTime;
    this.stopTime = stopTime;
  }

  /**
   * Create a TimingLine from the given string.
   *
   * @param line - The line to parse.
   * @returns A TimingLine instance or undefined if parsing failed.
   */
  static fromSdpLine(line: string): TimingLine | undefined {
    if (!TimingLine.regex.test(line)) {
      return undefined;
    }
    const tokens = line.match(TimingLine.regex) as RegExpMatchArray;
    const startTime = parseInt(tokens[1], 10);
    const stopTime = parseInt(tokens[2], 10);

    return new TimingLine(startTime, stopTime);
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    return `t=${this.startTime} ${this.stopTime}`;
  }
}
