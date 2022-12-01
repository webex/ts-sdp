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

import { NUM, ANY_NON_WS } from '../regex-helpers';
import { Line } from './line';

/**
 * Definition of an origin line as defined by https://datatracker.ietf.org/doc/html/rfc4566#section-5.2.
 *
 * @example
 * o=- 3510072484341496656 2 IN IP4 127.0.0.1
 */
export class OriginLine extends Line {
  username: string;

  // Values are usually too large to be held in a number, so store it in a string
  sessionId: string;

  sessionVersion: number;

  netType: string;

  addrType: string;

  ipAddr: string;

  private static regex = new RegExp(
    `^(${ANY_NON_WS}) (${ANY_NON_WS}) (${NUM}) (${ANY_NON_WS}) (${ANY_NON_WS}) (${ANY_NON_WS})`
  );

  /**
   * Create an OriginLine from the given values.
   *
   * @param username - The username.
   * @param sessionId - The session ID.
   * @param sessionVersion - The session version.
   * @param netType - The network type.
   * @param addrType - The network address type.
   * @param ipAddr - The network address.
   */
  constructor(
    username: string,
    sessionId: string,
    sessionVersion: number,
    netType: string,
    addrType: string,
    ipAddr: string
  ) {
    super();
    this.username = username;
    this.sessionId = sessionId;
    this.sessionVersion = sessionVersion;
    this.netType = netType;
    this.addrType = addrType;
    this.ipAddr = ipAddr;
  }

  /**
   * Create an OriginLine from the given string.
   *
   * @param line - The line to parse.
   * @returns An OriginLine instance or undefined if parsing failed.
   */
  static fromSdpLine(line: string): OriginLine | undefined {
    if (!OriginLine.regex.test(line)) {
      return undefined;
    }
    const tokens = line.match(OriginLine.regex) as RegExpMatchArray;
    const username = tokens[1];
    const sessionId = tokens[2];
    const sessionVersion = parseInt(tokens[3], 10);
    const netType = tokens[4];
    const addrType = tokens[5];
    const ipAddr = tokens[6];
    return new OriginLine(username, sessionId, sessionVersion, netType, addrType, ipAddr);
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    return `o=${this.username} ${this.sessionId} ${this.sessionVersion} ${this.netType} ${this.addrType} ${this.ipAddr}`;
  }
}
