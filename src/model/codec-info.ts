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

import { FmtpLine, Line, RtcpFbLine, RtpMapLine } from '../lines';
import { SdpBlock } from './sdp-block';

/**
 * Model all information related to a specific codec in an SDP.
 */
export class CodecInfo implements SdpBlock {
  pt: number;

  name?: string;

  clockRate?: number;

  encodingParams?: string;

  fmtParams: Map<string, string | undefined> = new Map();

  feedback: Array<string> = [];

  // If this codec is a 'secondary codec', this field will contain the payload type
  // of its 'primary' codec.
  primaryCodecPt?: number;

  /**
   * Create a CodecInfo from the given values.
   *
   * @param pt - The payload type.
   */
  constructor(pt: number) {
    this.pt = pt;
  }

  /**
   * @inheritdoc
   */
  addLine(line: Line): boolean {
    if (line instanceof RtpMapLine) {
      this.name = line.encodingName;
      this.clockRate = line.clockRate;
      this.encodingParams = line.encodingParams;
      return true;
    }
    if (line instanceof FmtpLine) {
      this.fmtParams = new Map([
        ...Array.from(this.fmtParams.entries()),
        ...Array.from(line.params.entries()),
      ]);
      if (line.params.has('apt')) {
        const apt = line.params.get('apt') as string;
        this.primaryCodecPt = parseInt(apt, 10);
      }
      return true;
    }
    if (line instanceof RtcpFbLine) {
      this.feedback.push(line.feedback);
      return true;
    }
    return false;
  }

  /**
   * @inheritdoc
   */
  toLines(): Array<Line> {
    const lines = [];
    // First the RtpMap
    lines.push(
      new RtpMapLine(this.pt, this.name as string, this.clockRate as number, this.encodingParams)
    );
    // Now all RtcpFb
    this.feedback.forEach((fb) => {
      lines.push(new RtcpFbLine(this.pt, fb));
    });
    // Now all Fmtp
    if (this.fmtParams.size > 0) {
      lines.push(new FmtpLine(this.pt, this.fmtParams));
    }
    return lines;
  }
}
