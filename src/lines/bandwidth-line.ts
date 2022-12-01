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

export type BandwidthType = 'CT' | 'AS' | 'TIAS';

/**
 * Model a bandwidth line in SDP as defined by https://datatracker.ietf.org/doc/html/rfc4566#section-5.8.
 *
 * @example
 * b=TIAS:20000000
 */
export class BandwidthLine extends Line {
  bandwidthType: BandwidthType;

  bandwidth: number;

  private static BW_TYPE_REGEX = 'CT|AS|TIAS';

  private static regex = new RegExp(`^(${this.BW_TYPE_REGEX}):(${NUM})`);

  /**
   * Create a BandwidthLine from the given values.
   *
   * @param bandwidthType - The bandwidth type.
   * @param bandwidth - The bandwidth.
   */
  constructor(bandwidthType: BandwidthType, bandwidth: number) {
    super();
    this.bandwidthType = bandwidthType;
    this.bandwidth = bandwidth;
  }

  /**
   * Create a BandwidthLine from the given string.
   *
   * @param line - The line to parse.
   * @returns A BandwidthLine instance or undefined if parsing failed.
   */
  static fromSdpLine(line: string): BandwidthLine | undefined {
    if (!BandwidthLine.regex.test(line)) {
      return undefined;
    }
    const tokens = line.match(BandwidthLine.regex) as RegExpMatchArray;
    const bandwidthType = tokens[1] as BandwidthType;
    const bandwidth = parseInt(tokens[2], 10);

    return new BandwidthLine(bandwidthType, bandwidth);
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    return `b=${this.bandwidthType}:${this.bandwidth}`;
  }
}
