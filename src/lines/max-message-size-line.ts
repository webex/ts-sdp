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

import { NUM } from '../regex-helpers';
import { Line } from './line';

/**
 * Model a max-message-size line in an SDP.
 *
 * @example
 * a=max-message-size:32400
 */
export class MaxMessageSizeLine extends Line {
  maxMessageSize: number;

  private static regex = new RegExp(`^max-message-size:(${NUM})`);

  /**
   * Create a new MaxMessageSizeLine from the given values.
   *
   * @param maxMessageSize - The max message size.
   */
  constructor(maxMessageSize: number) {
    super();
    this.maxMessageSize = maxMessageSize;
  }

  /**
   * Create a MaxMessageSizeLine from the given string.
   *
   * @param line - The line to parse.
   * @returns A MaxMessageSizeLine instance or undefined if parsing failed.
   */
  static fromSdpLine(line: string): MaxMessageSizeLine | undefined {
    if (!MaxMessageSizeLine.regex.test(line)) {
      return undefined;
    }
    const tokens = line.match(MaxMessageSizeLine.regex) as RegExpMatchArray;
    const maxMessageSize = parseInt(tokens[1], 10);

    return new MaxMessageSizeLine(maxMessageSize);
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    return `a=max-message-size:${this.maxMessageSize}`;
  }
}
