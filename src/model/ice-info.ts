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

import { CandidateLine, IceOptionsLine, IcePwdLine, IceUfragLine, Line } from '../lines';
import { SdpBlock } from './sdp-block';

/**
 * Model all of the ICE-related information.
 */
export class IceInfo implements SdpBlock {
  ufrag?: IceUfragLine;

  pwd?: IcePwdLine;

  options?: IceOptionsLine;

  candidates: Array<CandidateLine> = [];

  /**
   * @inheritdoc
   */
  addLine(line: Line): boolean {
    if (line instanceof IceUfragLine) {
      this.ufrag = line;
      return true;
    }
    if (line instanceof IcePwdLine) {
      this.pwd = line;
      return true;
    }
    if (line instanceof IceOptionsLine) {
      this.options = line;
      return true;
    }
    if (line instanceof CandidateLine) {
      this.candidates.push(line);
      return true;
    }
    return false;
  }

  /**
   * @inheritdoc
   */
  toLines(): Array<Line> {
    const lines: Array<Line> = [];
    if (this.ufrag) {
      lines.push(this.ufrag);
    }
    if (this.pwd) {
      lines.push(this.pwd);
    }
    if (this.options) {
      lines.push(this.options);
    }
    this.candidates.forEach((candidate) => lines.push(candidate));
    return lines;
  }
}
