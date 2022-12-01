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
 * Models an ICE ufrag line.
 *
 * @example
 * a=ice-ufrag:LJmN
 */
export class IceUfragLine extends Line {
  ufrag: string;

  private static regex = new RegExp(`^ice-ufrag:(${ANY_NON_WS})$`);

  /**
   * Create an IceUfragLine from the given values.
   *
   * @param ufrag - The ufrag.
   */
  constructor(ufrag: string) {
    super();
    this.ufrag = ufrag;
  }

  /**
   * Create an IceUfragLine from the given string.
   *
   * @param line - The line to parse.
   * @returns An IceUfragLine instance or undefined if parsing failed.
   */
  static fromSdpLine(line: string): IceUfragLine | undefined {
    if (!IceUfragLine.regex.test(line)) {
      return undefined;
    }
    const tokens = line.match(IceUfragLine.regex) as RegExpMatchArray;
    const ufrag = tokens[1];

    return new IceUfragLine(ufrag);
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    return `a=ice-ufrag:${this.ufrag}`;
  }
}
