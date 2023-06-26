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
 * Parse the fmtpParams because SDP has no such util function for that.
 *
 * @param fmtpParams -  like `key1=val1;key2=val2;key3=val3".
 * @returns A JS key-value object.
 */
export function parseFmtpParams(fmtpParams: string) {
  // compatible with Safari, since its `fmtpParams` here contains a prefix as `a=fmtp:{payloadType} `, and separated by space.
  // eslint-disable-next-line no-param-reassign
  fmtpParams = fmtpParams.replace(/^a=fmtp:\d+\x20/, '');

  const fmtpObj = new Map<string, string | undefined>();

  // compatible with RED，such as `a=fmtp:121 0/5` in chrome and `a=fmtp:121 0-5` in firefox, which can {@link https://www.rfc-editor.org/rfc/rfc2198}
  // also compatible with special case `a=fmtp:126 0-15,16`, see https://jira-eng-gpk2.cisco.com/jira/browse/SPARK-440089.
  if (/^\d+([,/-]\d+)+$/.test(fmtpParams)) {
    fmtpObj.set(fmtpParams, undefined);
    return fmtpObj;
  }

  fmtpParams.split(';').forEach((param) => {
    const paramArr = param && param.split('=');
    if (paramArr.length !== 2 || !paramArr[0] || !paramArr[1]) {
      throw new Error(`Fmtp params is invalid with ${fmtpParams}`);
    }
    // eslint-disable-next-line prefer-destructuring
    fmtpObj.set(paramArr[0], paramArr[1]);
  });
  return fmtpObj;
}

/**
 * Definition of a fmtp attribute line as defined in https://datatracker.ietf.org/doc/html/rfc4566#section-6.
 *
 * @example
 * a=fmtp:97 apt=96
 */
export class FmtpLine extends Line {
  payloadType: number;

  params: Map<string, string | undefined>;

  private static regex = new RegExp(`^fmtp:(${NUM}) (${REST})`);

  /**
   * Create an FmtpLine from the given values.
   *
   * @param payloadType - The payload type.
   * @param params - The fmtp parameters.
   */
  constructor(payloadType: number, params: Map<string, string | undefined>) {
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

    return new FmtpLine(payloadType, parseFmtpParams(params));
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    const fmtParams = Array.from(this.params.keys())
      .map((key) => {
        if (this.params.get(key) !== undefined) {
          return `${key}=${this.params.get(key)}`;
        }
        return `${key}`;
      })
      .join(';');
    return `a=fmtp:${this.payloadType} ${fmtParams}`;
  }
}
