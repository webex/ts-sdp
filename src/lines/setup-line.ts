import { Line } from './line';

export type Setup = 'actpass' | 'active' | 'passive';

/**
 * Definition of a setup attribute
 *
 * Ex: a=setup:actpass
 */
export class SetupLine extends Line {
  setup: Setup;

  private static regex = /^setup:(actpass|active|passive)$/;

  /**
   * Create a SetupLine from the given values.
   *
   * @param setup - The setup value.
   */
  constructor(setup: Setup) {
    super();
    this.setup = setup;
  }

  /**
   * Create a SetupLine from the given string.
   *
   * @param line - The line to parse.
   * @returns A SetupLine instance or undefined if parsing failed.
   */
  static fromSdpLine(line: string): SetupLine | undefined {
    if (!SetupLine.regex.test(line)) {
      return undefined;
    }
    const tokens = line.match(SetupLine.regex) as RegExpMatchArray;
    const setup = tokens[1] as Setup;

    return new SetupLine(setup);
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    return `a=setup:${this.setup}`;
  }
}
