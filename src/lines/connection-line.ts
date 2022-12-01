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
 * Definition of a connection description as defined by https://datatracker.ietf.org/doc/html/rfc4566#section-5.7.
 *
 * @example
 * c=IN IP4 0.0.0.0
 */
export class ConnectionLine extends Line {
  netType: string;

  addrType: string;

  ipAddr: string;

  private static regex = new RegExp(`^(${ANY_NON_WS}) (${ANY_NON_WS}) (${ANY_NON_WS})`);

  /**
   * Create a ConnectionLine from the given values.
   *
   * @param netType - The network type.
   * @param addrType - The network address type.
   * @param ipAddr - The IP address.
   */
  constructor(netType: string, addrType: string, ipAddr: string) {
    super();
    this.netType = netType;
    this.addrType = addrType;
    this.ipAddr = ipAddr;
  }

  /**
   * Create a ConnectionLine from the given string.
   *
   * @param line - The line to parse.
   * @returns A ConnectionLine instance or undefined if parsing failed.
   */
  static fromSdpLine(line: string): ConnectionLine | undefined {
    if (!ConnectionLine.regex.test(line)) {
      return undefined;
    }
    const tokens = line.match(ConnectionLine.regex) as RegExpMatchArray;
    const netType = tokens[1];
    const addrType = tokens[2];
    const ipAddr = tokens[3];

    return new ConnectionLine(netType, addrType, ipAddr);
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    return `c=${this.netType} ${this.addrType} ${this.ipAddr}`;
  }
}
