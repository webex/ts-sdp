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

import { SsrcGroupLine } from './ssrc-group-line';

describe('ssrc group line', () => {
  it('should parse valid lines correctly', () => {
    expect.hasAssertions();
    {
      const line = 'ssrc-group:SIM 123 456 789';
      const result = SsrcGroupLine.fromSdpLine(line);

      expect(result).toBeTruthy();
      expect(result?.semantics).toBe('SIM');
      expect(result?.ssrcs).toStrictEqual([123, 456, 789]);
    }
    {
      const line = 'ssrc-group:FID 123 456';
      const result = SsrcGroupLine.fromSdpLine(line);

      expect(result).toBeTruthy();
      expect(result?.semantics).toBe('FID');
      expect(result?.ssrcs).toStrictEqual([123, 456]);
    }
  });

  it('should fail to parse invalid lines', () => {
    expect.hasAssertions();

    expect(SsrcGroupLine.fromSdpLine('foo:FID 123 456')).toBeFalsy();
    expect(SsrcGroupLine.fromSdpLine('ssrc-group:BAR 123 456')).toBeFalsy();
    expect(SsrcGroupLine.fromSdpLine('ssrc-group:FID abc def')).toBeFalsy();
  });

  it('should serialize correctly', () => {
    expect.hasAssertions();

    expect(new SsrcGroupLine('SIM', [123, 456, 789]).toSdpLine()).toBe(
      'a=ssrc-group:SIM 123 456 789'
    );
    expect(new SsrcGroupLine('FID', [123, 456]).toSdpLine()).toBe('a=ssrc-group:FID 123 456');
  });
});
