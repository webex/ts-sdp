import { REST } from '../regex-helpers';
import { Line } from './line';

/**
 * Models a fingerprint line from an SDP.
 *
 * @example
 * a=fingerprint:sha-256 DE:AD:BE:EF
 */
export class FingerprintLine extends Line {
  fingerprint: string;

  private static regex = new RegExp(`^fingerprint:(${REST})`);

  /**
   * Create a FingerprintLine from the given values.
   *
   * @param fingerprint - The hash and fingerprint.
   */
  constructor(fingerprint: string) {
    super();
    this.fingerprint = fingerprint;
  }

  /**
   * Create a FingerprintLine from the given string.
   *
   * @param line - The line to parse.
   * @returns A FingerprintLine instance or undefined if parsing failed.
   */
  static fromSdpLine(line: string): FingerprintLine | undefined {
    if (!FingerprintLine.regex.test(line)) {
      return undefined;
    }
    const tokens = line.match(FingerprintLine.regex) as RegExpMatchArray;
    const fingerprint = tokens[1];

    return new FingerprintLine(fingerprint);
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    return `a=fingerprint:${this.fingerprint}`;
  }
}
