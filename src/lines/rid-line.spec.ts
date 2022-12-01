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

import { RidLine } from './rid-line';

describe('rid line', () => {
  it('should parse a line with no restrictions correctly', () => {
    expect.hasAssertions();
    const line = 'rid:0 recv';
    const result = RidLine.fromSdpLine(line);

    expect(result).toBeTruthy();
    expect(result?.id).toBe('0');
    expect(result?.direction).toBe('recv');
    expect(result?.params).toBeUndefined();
    expect(result?.toSdpLine()).toBe('a=rid:0 recv');
  });

  it('should parse a line with basic restrictions correctly', () => {
    expect.hasAssertions();
    const line = 'rid:1 send max-width=1280;max-height=720;max-fps=30';
    const result = RidLine.fromSdpLine(line);

    expect(result).toBeTruthy();
    expect(result?.id).toBe('1');
    expect(result?.direction).toBe('send');
    expect(result?.params).toBe('max-width=1280;max-height=720;max-fps=30');
    expect(result?.toSdpLine()).toBe('a=rid:1 send max-width=1280;max-height=720;max-fps=30');
  });

  it('should parse a line with payload types and restrictions correctly', () => {
    expect.hasAssertions();
    const line = 'rid:5 send pt=99,102;max-br=64000';
    const result = RidLine.fromSdpLine(line);

    expect(result).toBeTruthy();
    expect(result?.id).toBe('5');
    expect(result?.direction).toBe('send');
    expect(result?.params).toBe('pt=99,102;max-br=64000');
    expect(result?.toSdpLine()).toBe('a=rid:5 send pt=99,102;max-br=64000');
  });

  it('should parse a line with payload types and no restrictions correctly', () => {
    expect.hasAssertions();
    const line = 'rid:6 send pt=100,97,101,102';
    const result = RidLine.fromSdpLine(line);

    expect(result).toBeTruthy();
    expect(result?.id).toBe('6');
    expect(result?.direction).toBe('send');
    expect(result?.params).toBe('pt=100,97,101,102');
    expect(result?.toSdpLine()).toBe('a=rid:6 send pt=100,97,101,102');
  });

  it('should not parse these cases', () => {
    expect.hasAssertions();
    const line1 = 'rid:@abc recv';
    const result1 = RidLine.fromSdpLine(line1);

    expect(result1).toBeFalsy();

    const line2 = 'rid:0 sendrecv';
    const result2 = RidLine.fromSdpLine(line2);

    expect(result2).toBeFalsy();
  });
});
