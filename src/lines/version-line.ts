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
 * Definition of a version as defined by https://datatracker.ietf.org/doc/html/rfc4566#section-5.1.
 *
 * @example
 * v=0
 */
export class VersionLine extends Line {
  version: number;

  private static regex = new RegExp(`^(${NUM})$`);

  /**
   * Create a VersionLine instance.
   *
   * @param version - The version.
   */
  constructor(version: number) {
    super();
    this.version = version;
  }

  /**
   * Create a VersionLine from the given string.
   *
   * @param line - The line to parse.
   * @returns A VersionLine instance or undefined if parsing failed.
   */
  static fromSdpLine(line: string): VersionLine | undefined {
    if (!VersionLine.regex.test(line)) {
      return undefined;
    }
    const tokens = line.match(VersionLine.regex) as RegExpMatchArray;
    const version = parseInt(tokens[1], 10);
    return new VersionLine(version);
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    return `v=${this.version}`;
  }
}
