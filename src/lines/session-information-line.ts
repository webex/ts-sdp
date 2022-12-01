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

import { REST } from '../regex-helpers';
import { Line } from './line';

/**
 * Definition of a session information line as defined by https://datatracker.ietf.org/doc/html/rfc4566#section-5.4.
 *
 * @example
 * i=foobar-v1
 */
export class SessionInformationLine extends Line {
  info: string;

  private static regex = new RegExp(`(${REST})`);

  /**
   * Create a SessionInformationLine from the given values.
   *
   * @param info - The session information.
   */
  constructor(info: string) {
    super();
    this.info = info;
  }

  /**
   * Create a SessionInformationLine from the given string.
   *
   * @param line - The line to parse.
   * @returns A SessionInformationLine or undefined if parsing failed.
   */
  static fromSdpLine(line: string): SessionInformationLine | undefined {
    if (!SessionInformationLine.regex.test(line)) {
      return undefined;
    }

    const tokens = line.match(SessionInformationLine.regex) as RegExpMatchArray;
    const info = tokens[1];

    return new SessionInformationLine(info);
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    return `i=${this.info}`;
  }
}
