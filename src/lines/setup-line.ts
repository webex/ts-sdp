import { Line } from './line';

export type Setup = 'actpass' | 'active' | 'passive';

/**
 * Definition of a setup attribute
 *
 * Ex: a=setup:actpass
 */
export class SetupLine extends Line {
  setup: Setup;

  private static regex = new RegExp(`^setup:(actpass|active|passive)$`);

  constructor(setup: Setup) {
    super();
    this.setup = setup;
  }

  static fromSdpLine(line: string): SetupLine | undefined {
    if (!SetupLine.regex.test(line)) {
      return undefined;
    }
    const tokens = line.match(SetupLine.regex) as RegExpMatchArray;
    const setup = tokens[1] as Setup;

    return new SetupLine(setup);
  }

  toSdpLine(): string {
    return `a=setup:${this.setup}`;
  }
}
