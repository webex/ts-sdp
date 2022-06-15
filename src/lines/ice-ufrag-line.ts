import { TOKEN } from '../regex-helpers';
import { Line } from './line';

/**
 * Models an ICE ufrag line.
 *
 * @example
 * a=ice-ufrag:LJmN
 */
export class IceUfragLine extends Line {
  ufrag: string;

  private static regex = new RegExp(`^ice-ufrag:(${TOKEN})$`);

  /**
   * Create an IceUfragLine from the given values.
   *
   * @param ufrag - The ufrag.
   */
  constructor(ufrag: string) {
    super();
    this.ufrag = ufrag;
  }

  /**
   * Create an IceUfragLine from the given string.
   *
   * @param line - The line to parse.
   * @returns An IceUfragLine instance or undefined if parsing failed.
   */
  static fromSdpLine(line: string): IceUfragLine | undefined {
    if (!IceUfragLine.regex.test(line)) {
      return undefined;
    }
    const tokens = line.match(IceUfragLine.regex) as RegExpMatchArray;
    const ufrag = tokens[1];

    return new IceUfragLine(ufrag);
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    return `a=ice-ufrag:${this.ufrag}`;
  }
}
