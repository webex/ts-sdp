import { REST } from '../regex-helpers';
import { Line } from './line';

/**
 * Definition of a session information line as defined by https://datatracker.ietf.org/doc/html/rfc4566#section-5.4.
 *
 * @example
 * i=foobar-v1
 */
export class SessionInformationLine extends Line {
  info: string;

  private static regex = new RegExp(`(${REST})`);

  /**
   * Create a SessionInformationLine from the given values.
   *
   * @param info - The session information.
   */
  constructor(info: string) {
    super();
    this.info = info;
  }

  /**
   * Create a SessionInformationLine from the given string.
   *
   * @param line - The line to parse.
   * @returns A SessionInformationLine or undefined if parsing failed.
   */
  static fromSdpLine(line: string): SessionInformationLine | undefined {
    if (!SessionInformationLine.regex.test(line)) {
      return undefined;
    }

    const tokens = line.match(SessionInformationLine.regex) as RegExpMatchArray;
    const info = tokens[1];

    return new SessionInformationLine(info);
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    return `i=${this.info}`;
  }
}
