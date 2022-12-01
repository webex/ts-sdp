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

import { Line } from '../lines';

/**
 * A grouping of multiple related lines/information within an SDP.
 */
export interface SdpBlock {
  /**
   * Add a parsed line to this block.
   *
   * @param line - The line to add.
   * @returns True if the line was successfully added by this block, false otherwise.
   */
  addLine(line: Line): boolean;

  /**
   * Convert this SdpBlock to an array of Lines.
   *
   * @returns - An array containing all the lines for this block.
   */
  toLines(): Array<Line>;
}
