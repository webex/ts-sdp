import { NUM } from '../regex-helpers';
import { Line } from './line';

/**
 * Definition of a version as defined by https://datatracker.ietf.org/doc/html/rfc4566#section-5.1.
 *
 * @example
 * v=0
 */
export class VersionLine extends Line {
  version: number;

  private static regex = new RegExp(`^(${NUM})$`);

  /**
   * Create a VersionLine instance.
   *
   * @param version - The version.
   */
  constructor(version: number) {
    super();
    this.version = version;
  }

  /**
   * Create a VersionLine from the given string.
   *
   * @param line - The line to parse.
   * @returns A VersionLine instance or undefined if parsing failed.
   */
  static fromSdpLine(line: string): VersionLine | undefined {
    if (!VersionLine.regex.test(line)) {
      return undefined;
    }
    const tokens = line.match(VersionLine.regex) as RegExpMatchArray;
    const version = parseInt(tokens[1], 10);
    return new VersionLine(version);
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    return `v=${this.version}`;
  }
}
