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

import { ExtMapLine } from './extmap-line';

describe('extmap line', () => {
  it('should parse a line with basic URI correctly', () => {
    expect.hasAssertions();
    const line = 'extmap:1 http://example.com/082005/ext.htm#ttime';
    const result = ExtMapLine.fromSdpLine(line);

    expect(result).toBeTruthy();
    expect(result?.id).toBe(1);
    expect(result?.uri).toBe('http://example.com/082005/ext.htm#ttime');
    expect(result?.direction).toBeUndefined();
    expect(result?.extensionAttributes).toBeUndefined();
    expect(result?.toSdpLine()).toBe('a=extmap:1 http://example.com/082005/ext.htm#ttime');
  });

  it('should parse a line with direction, URI, and extension attributes correctly', () => {
    expect.hasAssertions();
    const line = 'extmap:2/sendrecv http://example.com/082005/ext.htm#xmeta short';
    const result = ExtMapLine.fromSdpLine(line);

    expect(result).toBeTruthy();
    expect(result?.id).toBe(2);
    expect(result?.uri).toBe('http://example.com/082005/ext.htm#xmeta');
    expect(result?.direction).toBe('sendrecv');
    expect(result?.extensionAttributes).toBe('short');
    expect(result?.toSdpLine()).toBe(
      'a=extmap:2/sendrecv http://example.com/082005/ext.htm#xmeta short'
    );
  });
});
