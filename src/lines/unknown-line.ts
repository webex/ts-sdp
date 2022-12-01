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

import { REST } from '../regex-helpers';
import { Line } from './line';

/**
 * Models any line which the grammar fails to parse.
 */
export class UnknownLine extends Line {
  value: string;

  private static regex = new RegExp(`(${REST})`);

  /**
   * Create a new UnknownLine instance from the given values.
   *
   * @param value - The line's value (besides the <type>=).
   */
  constructor(value: string) {
    super();
    this.value = value;
  }

  /**
   * Create an UnknownLine from the given string.
   *
   * @param line - The line to parse.
   * @returns A UnknownLine instance (parsing should always succeed).
   */
  static fromSdpLine(line: string): UnknownLine {
    const tokens = line.match(UnknownLine.regex) as RegExpMatchArray;

    const value = tokens[1];

    return new UnknownLine(value);
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    return `${this.value}`;
  }
}
