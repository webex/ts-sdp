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
 * Model a bundle group line in SDP.
 *
 * @example
 * a=group:BUNDLE 0 1 2
 */
export class BundleGroupLine extends Line {
  mids: Array<string>;

  private static regex = new RegExp(`^group:BUNDLE (${REST})`);

  /**
   * Create a BundleGroupLine from the given values.
   *
   * @param mids - The MIDs.
   */
  constructor(mids: Array<string>) {
    super();
    this.mids = mids;
  }

  /**
   * Create a BundleGroupLine from the given string.
   *
   * @param line - The line to parse.
   * @returns A BundleGroupLine instance or undefined if parsing failed.
   */
  static fromSdpLine(line: string): BundleGroupLine | undefined {
    if (!BundleGroupLine.regex.test(line)) {
      return undefined;
    }
    const tokens = line.match(BundleGroupLine.regex) as RegExpMatchArray;
    const mids = tokens[1].split(' ');

    return new BundleGroupLine(mids);
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    return `a=group:BUNDLE ${this.mids.join(' ')}`;
  }
}
