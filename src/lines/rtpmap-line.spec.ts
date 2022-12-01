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

import { RtpMapLine } from './rtpmap-line';

describe('rtpmap line', () => {
  it('should parse a line without additional encoding parameters correctly', () => {
    expect.hasAssertions();
    const line = 'rtpmap:42 h264/9000';
    const result = RtpMapLine.fromSdpLine(line);

    expect(result).toBeTruthy();
    expect(result?.encodingName).toBe('h264');
    expect(result?.clockRate).toBe(9000);
    expect(result?.encodingParams).toBeUndefined();
  });

  it('should parse a line with additional encoding parameters correctly', () => {
    expect.hasAssertions();
    const line = 'rtpmap:42 opus/48000/2';
    const result = RtpMapLine.fromSdpLine(line);

    expect(result).toBeTruthy();
    expect(result?.encodingName).toBe('opus');
    expect(result?.clockRate).toBe(48000);
    expect(result?.encodingParams).toBe('2');
  });
});
