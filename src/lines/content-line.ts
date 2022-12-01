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
 * Model the a=content line of the SDP, as defined in rfc4796.
 *
 * @example
 * a=content:slides
 */
export class ContentLine extends Line {
  values: Array<string>;

  private static regex = new RegExp(`^content:(${REST})$`);

  /**
   * Create a ContentLine from the given values.
   *
   * @param values - Array of content values.
   */
  constructor(values: Array<string>) {
    super();
    this.values = values;
  }

  /**
   * Create a ContentLine from the given string.
   *
   * @param line - The line to parse.
   * @returns A ContentLine instance or undefined if parsing failed.
   */
  static fromSdpLine(line: string): ContentLine | undefined {
    if (!ContentLine.regex.test(line)) {
      return undefined;
    }

    const tokens = line.match(ContentLine.regex) as RegExpMatchArray;
    const values = tokens[1].split(',');

    return new ContentLine(values);
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    return `a=content:${this.values.join(',')}`;
  }
}
