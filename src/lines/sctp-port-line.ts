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
 * Models an sctp-port line.
 *
 * @example
 * a=sctp-port:5000
 */
export class SctpPortLine extends Line {
  port: number;

  private static regex = new RegExp(`^sctp-port:(${NUM})`);

  /**
   * Create an SctpPortLine from the given values.
   *
   * @param port - The port.
   */
  constructor(port: number) {
    super();
    this.port = port;
  }

  /**
   * Create a SctpPortLine from the given string.
   *
   * @param line - The line to parse.
   * @returns A SctpPortLine instance or undefined if parsing failed.
   */
  static fromSdpLine(line: string): SctpPortLine | undefined {
    if (!SctpPortLine.regex.test(line)) {
      return undefined;
    }
    const tokens = line.match(SctpPortLine.regex) as RegExpMatchArray;
    const port = parseInt(tokens[1], 10);

    return new SctpPortLine(port);
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    return `a=sctp-port:${this.port}`;
  }
}
