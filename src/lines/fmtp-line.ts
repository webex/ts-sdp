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

import { NUM, REST } from '../regex-helpers';
import { Line } from './line';

/**
 * Definition of a fmtp attribute line as defined in https://datatracker.ietf.org/doc/html/rfc4566#section-6.
 *
 * @example
 * a=fmtp:97 apt=96
 */
export class FmtpLine extends Line {
  payloadType: number;

  params: string;

  private static regex = new RegExp(`^fmtp:(${NUM}) (${REST})`);

  /**
   * Create an FmtpLine from the given values.
   *
   * @param payloadType - The payload type.
   * @param params - The fmtp parameters.
   */
  constructor(payloadType: number, params: string) {
    super();
    this.payloadType = payloadType;
    this.params = params;
  }

  /**
   * Create a FmtpLine from the given string.
   *
   * @param line - The line to parse.
   * @returns A FmtpLine instance or undefined if parsing failed.
   */
  static fromSdpLine(line: string): FmtpLine | undefined {
    if (!FmtpLine.regex.test(line)) {
      return undefined;
    }
    const tokens = line.match(FmtpLine.regex) as RegExpMatchArray;
    const payloadType = parseInt(tokens[1], 10);
    const params = tokens[2];

    return new FmtpLine(payloadType, params);
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    return `a=fmtp:${this.payloadType} ${this.params}`;
  }
}
