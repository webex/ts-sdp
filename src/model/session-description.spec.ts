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

import {
  BandwidthLine,
  BundleGroupLine,
  ConnectionLine,
  OriginLine,
  SessionInformationLine,
  SessionNameLine,
  TimingLine,
  VersionLine,
} from '../lines';
import { SessionDescription } from './session-description';

describe('session description', () => {
  it('should put the lines in the correct order', () => {
    expect.hasAssertions();
    const sd = new SessionDescription();
    sd.version = new VersionLine(0);
    sd.origin = new OriginLine('username', 'sessionId', 42, 'IN', 'IPV4', '127.0.0.1');
    sd.sessionName = new SessionNameLine('session-name');
    sd.information = new SessionInformationLine('info');
    sd.connection = new ConnectionLine('IN', 'IPV4', '127.0.0.1');
    sd.timing = new TimingLine(0, 0);
    sd.groups.push(new BundleGroupLine(['1', '2', '3']));
    sd.bandwidth = new BandwidthLine('TIAS', 1000000);
    const lines = sd.toLines();
    expect(lines.indexOf(sd.version)).toBe(0);
    expect(lines.indexOf(sd.origin)).toBe(1);
    expect(lines.indexOf(sd.sessionName)).toBe(2);
    expect(lines.indexOf(sd.information)).toBe(3);
    expect(lines.indexOf(sd.connection)).toBe(4);
    expect(lines.indexOf(sd.bandwidth)).toBe(5);
    expect(lines.indexOf(sd.timing)).toBe(6);
  });
});
