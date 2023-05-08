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

import { NUM, REST, ANY_NON_WS } from '../regex-helpers';
import { Line } from './line';

export type ExtMapDirection = 'sendonly' | 'recvonly' | 'sendrecv' | 'inactive';

/**
 * Model an extmap line from an SDP as defined by https://datatracker.ietf.org/doc/html/rfc5285#section-5.
 *
 * @example
 * a=extmap:1 urn:ietf:params:rtp-hdrext:toffset
 */
export class ExtMapLine extends Line {
  id: number;

  direction?: 'sendonly' | 'recvonly' | 'sendrecv' | 'inactive';

  uri: string;

  extensionAttributes?: string;

  private static EXTMAP_DIRECTION = `sendonly|recvonly|sendrecv|inactive`;

  private static regex = new RegExp(
    `^extmap:(${NUM})(?:/(${this.EXTMAP_DIRECTION}))? (${ANY_NON_WS})(?: (${REST}))?`
  );

  /**
   * Create an ExtMapLine from the given values.
   *
   * @param id - The ID.
   * @param uri - The URI.
   * @param direction - The stream direction.
   * @param extensionAttributes - The attributes of the extension.
   */
  constructor(id: number, uri: string, direction?: ExtMapDirection, extensionAttributes?: string) {
    super();
    this.id = id;
    this.uri = uri;
    this.direction = direction;
    this.extensionAttributes = extensionAttributes;
  }

  /**
   * Create an ExtMapLine from the given string.
   *
   * @param line - The line to parse.
   * @returns An ExtMapLine instance or undefined if parsing failed.
   */
  static fromSdpLine(line: string): ExtMapLine | undefined {
    if (!ExtMapLine.regex.test(line)) {
      return undefined;
    }
    const tokens = line.match(ExtMapLine.regex) as RegExpMatchArray;
    const id = parseInt(tokens[1], 10);
    const direction = tokens[2] as 'sendonly' | 'recvonly' | 'sendrecv' | 'inactive';
    const uri = tokens[3];
    const extensionAttributes = tokens[4];

    return new ExtMapLine(id, uri, direction, extensionAttributes);
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    let str = '';
    str += `a=extmap:${this.id}`;
    if (this.direction) {
      str += `/${this.direction}`;
    }
    str += ` ${this.uri}`;
    if (this.extensionAttributes) {
      str += ` ${this.extensionAttributes}`;
    }
    return str;
  }
}
