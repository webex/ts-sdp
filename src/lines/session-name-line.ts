import { REST } from '../regex-helpers';
import { Line } from './line';

/**
 * Session name as defined by https://datatracker.ietf.org/doc/html/rfc4566#section-5.3.
 *
 * @example
 * s=session_name
 */
export class SessionNameLine extends Line {
  name: string;

  private static regex = new RegExp(`^(${REST})`);

  /**
   * Create a SessionNameLine from the given values.
   *
   * @param name - The name.
   */
  constructor(name: string) {
    super();
    this.name = name;
  }

  /**
   * Create a SessionNameLine from the given string.
   *
   * @param line - The line to parse.
   * @returns A SessionNameLine instance or undefined if parsing failed.
   */
  static fromSdpLine(line: string): SessionNameLine | undefined {
    if (!SessionNameLine.regex.test(line)) {
      return undefined;
    }
    const tokens = line.match(SessionNameLine.regex) as RegExpMatchArray;
    const name = tokens[1];

    return new SessionNameLine(name);
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    return `s=${this.name}`;
  }
}
