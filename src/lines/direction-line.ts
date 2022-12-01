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

export type MediaDirection = 'sendrecv' | 'sendonly' | 'recvonly' | 'inactive';

/**
 * Definition of a direction attribute line as defined in https://datatracker.ietf.org/doc/html/rfc4566#section-6.
 *
 * @example
 * a=sendrecv
 */
export class DirectionLine extends Line {
  direction: MediaDirection;

  private static regex = /^(sendrecv|sendonly|recvonly|inactive)$/;

  /**
   * Create a DirectionLine from the given values.
   *
   * @param direction - The direction.
   */
  constructor(direction: MediaDirection) {
    super();
    this.direction = direction;
  }

  /**
   * Create a DirectionLine from the given string.
   *
   * @param line - The line to parse.
   * @returns A DirectionLine instance or undefined if parsing failed.
   */
  static fromSdpLine(line: string): DirectionLine | undefined {
    if (!DirectionLine.regex.test(line)) {
      return undefined;
    }
    const tokens = line.match(DirectionLine.regex) as RegExpMatchArray;
    const direction = tokens[1] as MediaDirection;

    return new DirectionLine(direction);
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    return `a=${this.direction}`;
  }
}
