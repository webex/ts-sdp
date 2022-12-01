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

import { MediaLine, RtpMapLine } from './lines';
import { AvMediaDescription } from './model';
import { hasCodec } from './utils';

describe('hasCodec', () => {
  it('should return true only if the codec is present', () => {
    expect.hasAssertions();
    const mLine = new AvMediaDescription(
      new MediaLine('video', 9, 'UDP/TLS/RTP/SAVPF', ['96', '97', '98', '99', '100', '101', '127'])
    );
    mLine.addLine(new RtpMapLine(96, 'h264', 9000));

    expect(hasCodec('h264', mLine)).toBe(true);
    expect(hasCodec('H264', mLine)).toBe(true);
    expect(hasCodec('vp8', mLine)).toBe(false);
  });
});
