import { REST } from '../regex-helpers';
import { Line } from './line';

export class FingerprintLine extends Line {
  fingerprint: string;

  private static regex = new RegExp(`^fingerprint:(${REST})`);

  constructor(fingerprint: string) {
    super();
    this.fingerprint = fingerprint;
  }

  static fromSdpLine(line: string): FingerprintLine | undefined {
    if (!FingerprintLine.regex.test(line)) {
      return undefined;
    }
    const tokens = line.match(FingerprintLine.regex) as RegExpMatchArray;
    const fingerprint = tokens[1];

    return new FingerprintLine(fingerprint);
  }

  toSdpLine(): string {
    return `a=fingerprint:${this.fingerprint}`;
  }
}
