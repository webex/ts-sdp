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

import { OriginLine } from './origin-line';

describe('origin line', () => {
  it('should parse correctly', () => {
    expect.hasAssertions();
    const result = OriginLine.fromSdpLine('- 8643467220501996797 2 IN IP4 127.0.0.1') as OriginLine;
    expect(result).toBeTruthy();
    expect(result.username).toBe('-');
    expect(result.sessionId).toBe('8643467220501996797');
    expect(result.sessionVersion).toBe(2);
    expect(result.netType).toBe('IN');
    expect(result.addrType).toBe('IP4');
    expect(result.ipAddr).toBe('127.0.0.1');
  });
});
