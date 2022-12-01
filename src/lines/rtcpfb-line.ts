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
 * Implementation of an rtcp-fb attribute as defined by https://datatracker.ietf.org/doc/html/rfc4585#section-4.2.
 *
 * @example
 * a=rtcp-fb:96 goog-remb
 */
export class RtcpFbLine extends Line {
  payloadType: number;

  feedback: string;

  private static regex = new RegExp(`^rtcp-fb:(${NUM}) (${REST})`);

  /**
   * Create an RtcpFbLine from the given values.
   *
   * @param payloadType - The payload type.
   * @param feedback - The feedback name.
   */
  constructor(payloadType: number, feedback: string) {
    super();
    this.payloadType = payloadType;
    this.feedback = feedback;
  }

  /**
   * Create an RtcpFbLine from the given string.
   *
   * @param line - The line to parse.
   * @returns An RtcpFbLine instance or undefined if parsing failed.
   */
  static fromSdpLine(line: string): RtcpFbLine | undefined {
    if (!RtcpFbLine.regex.test(line)) {
      return undefined;
    }
    const tokens = line.match(RtcpFbLine.regex) as RegExpMatchArray;
    const payloadType = parseInt(tokens[1], 10);
    const feedback = tokens[2];

    return new RtcpFbLine(payloadType, feedback);
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    return `a=rtcp-fb:${this.payloadType} ${this.feedback}`;
  }
}
