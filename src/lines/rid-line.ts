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

import { REST, SP } from '../regex-helpers';
import { Line } from './line';

/**
 * Model a rid line from an SDP as defined by https://datatracker.ietf.org/doc/html/rfc8851.
 *
 * @example
 * a=rid:1 send pt=99,102;max-width=1280;max-height=720;max-fps=30
 */
export class RidLine extends Line {
  id: string;

  direction: 'send' | 'recv';

  params?: string;

  private static RID_ID = `[\\w-]+`;

  private static RID_DIRECTION = `\\bsend\\b|\\brecv\\b`;

  private static regex = new RegExp(
    `^rid:(${this.RID_ID}) (${this.RID_DIRECTION})(?:${SP}(${REST}))?`
  );

  /**
   * Create a RidLine from the given values.
   *
   * @param id - The ID.
   * @param direction - The stream direction to which the restrictions apply.
   * @param params - The restrictions that the stream will conform to (includes PTs).
   */
  constructor(id: string, direction: 'send' | 'recv', params?: string) {
    super();
    this.id = id;
    this.direction = direction;
    this.params = params;
  }

  /**
   * Create a RidLine from the given string.
   *
   * @param line - The line to parse.
   * @returns A RidLine instance or undefined if parsing failed.
   */
  static fromSdpLine(line: string): RidLine | undefined {
    if (!RidLine.regex.test(line)) {
      return undefined;
    }
    const tokens = line.match(RidLine.regex) as RegExpMatchArray;
    const id = tokens[1];
    const direction = tokens[2] as 'send' | 'recv';
    const params = tokens[3];

    return new RidLine(id, direction, params);
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    let str = '';
    str += `a=rid:${this.id} ${this.direction}`;
    if (this.params) {
      str += ` ${this.params}`;
    }
    return str;
  }
}
