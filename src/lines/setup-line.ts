/*
 * Copyright 2022 Cisco
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Line } from './line';

export type Setup = 'actpass' | 'active' | 'passive';

/**
 * Definition of a setup attribute.
 *
 * @example
 * a=setup:actpass
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
