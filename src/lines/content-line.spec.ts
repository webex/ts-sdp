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

import { ContentLine } from './content-line';

describe('content line', () => {
  it('should parse multiple values correctly', () => {
    expect.hasAssertions();
    const line = 'content:slides,powerpoint,screenShare';
    const result = ContentLine.fromSdpLine(line);

    expect(result).toBeTruthy();
    expect(result?.values).toStrictEqual(['slides', 'powerpoint', 'screenShare']);
  });
  it('should not parse a line with no values', () => {
    expect.hasAssertions();
    const line = 'content:';
    const result = ContentLine.fromSdpLine(line);

    expect(result).toBeUndefined();
  });
  describe('toSdpLine()', () => {
    it('works correctly', () => {
      expect.assertions(1);
      const contentLine = new ContentLine(['abc', 'def']);

      expect(contentLine.toSdpLine()).toBe('a=content:abc,def');
    });
  });
});
