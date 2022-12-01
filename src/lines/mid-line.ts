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

import { ANY_NON_WS } from '../regex-helpers';
import { Line } from './line';

/**
 * Models a mid line.
 *
 * @example
 * a=mid:1
 */
export class MidLine extends Line {
  mid: string;

  private static regex = new RegExp(`^mid:(${ANY_NON_WS})$`);

  /**
   * Create a MidLine from the given values.
   *
   * @param mid - The MID.
   */
  constructor(mid: string) {
    super();
    this.mid = mid;
  }

  /**
   * Create a MidLine from the given string.
   *
   * @param line - The line to parse.
   * @returns A MidLine instance or undefined if parsing failed.
   */
  static fromSdpLine(line: string): MidLine | undefined {
    if (!MidLine.regex.test(line)) {
      return undefined;
    }
    const tokens = line.match(MidLine.regex) as RegExpMatchArray;
    const mid = tokens[1];

    return new MidLine(mid);
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    return `a=mid:${this.mid}`;
  }
}
