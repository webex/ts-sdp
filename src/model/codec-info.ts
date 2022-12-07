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
 * Parse the fmtpParams because SDP has no such util function for that.
 *
 * @param fmtpParams -  like `key1=val1;key2=val2;key3=val3".
 * @returns A JS key-value object.
 */
export function parseFmtpParams(fmtpParams: string) {
  // compatible with Safari, since its `fmtpParams` here contains a prefix as `a=fmtp:{payloadType} `, and separated by space.
  // eslint-disable-next-line no-param-reassign
  fmtpParams = fmtpParams.replace(/^a=fmtp:\d+\x20/, '');
  const fmtpObj = {};
  fmtpParams.split(';').forEach((param) => {
    const paramArr = param && param.split('=');
    if (paramArr.length !== 2 || !paramArr[0] || !paramArr[1]) {
      throw new Error(`Fmtp params is invalid with ${fmtpParams}`);
    }
    // eslint-disable-next-line prefer-destructuring
    fmtpObj[paramArr[0]] = paramArr[1];
  });
  return fmtpObj;
}

/**
 * Model all information related to a specific codec in an SDP.
 */
export class CodecInfo implements SdpBlock {
  pt: number;

  name?: string;

  clockRate?: number;

  encodingParams?: string;

  fmtParams: Array<string> = [];

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
      this.fmtParams.push(line.params);
      if (line.params.indexOf('apt') !== -1) {
        const apt = line.params.split('=')[1];
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
    if (this.fmtParams.length > 0) {
      const targetFmtpObject = {};
      this.fmtParams
        .map((fmt) => parseFmtpParams(fmt))
        .forEach((fmtpObj) =>
          Object.keys(fmtpObj).forEach((key) => {
            targetFmtpObject[key] = fmtpObj[key];
          })
        );
      const newFmtParams = Object.keys(targetFmtpObject)
        .map((key) => `${key}=${targetFmtpObject[key]}`)
        .join(';');
      lines.push(new FmtpLine(this.pt, newFmtParams));
    }
    return lines;
  }
}
