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

export type MediaType = 'audio' | 'video' | 'application';

/**
 * Definition of a media description as defined by https://datatracker.ietf.org/doc/html/rfc4566#section-5.14.
 *
 * @example
 * m=video 9 UDP/TLS/RTP/SAVPF 96 97 98 99 100 101 127
 */
export class MediaLine extends Line {
  type: MediaType;

  port: number;

  protocol: string;

  formats: Array<string>;

  private static MEDIA_TYPE = 'audio|video|application';

  private static regex = new RegExp(`^(${this.MEDIA_TYPE}) (${NUM}) (${ANY_NON_WS}) (${REST})`);

  /**
   * Create a new MediaLine from the given values.
   *
   * @param type - The MediaType.
   * @param port - The port.
   * @param protocol - The protocol.
   * @param formats - The formats.
   */
  constructor(type: MediaType, port: number, protocol: string, formats: Array<string>) {
    super();
    this.type = type;
    this.port = port;
    this.protocol = protocol;
    this.formats = formats;
  }

  /**
   * Create a MediaLine from the given string.
   *
   * @param line - The line to parse.
   * @returns A MediaLine instance or undefined if parsing failed.
   */
  static fromSdpLine(line: string): MediaLine | undefined {
    if (!MediaLine.regex.test(line)) {
      return undefined;
    }
    const tokens = line.match(MediaLine.regex) as RegExpMatchArray;
    const type = tokens[1] as MediaType;
    const port = parseInt(tokens[2], 10);
    const protocol = tokens[3];
    const formats = tokens[4].split(' ');
    return new MediaLine(type, port, protocol, formats);
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    return `m=${this.type} ${this.port} ${this.protocol} ${this.formats.join(' ')}`;
  }
}
