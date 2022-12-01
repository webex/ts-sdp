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

import { SsrcLine } from './ssrc-line';

describe('ssrc line', () => {
  it('should parse a line with just an attribute correctly', () => {
    expect.hasAssertions();
    const line = 'ssrc:1234567 foo';
    const result = SsrcLine.fromSdpLine(line);

    expect(result).toBeTruthy();
    expect(result?.ssrcId).toBe(1234567);
    expect(result?.attribute).toBe('foo');
    expect(result?.attributeValue).toBeFalsy();
    expect(result?.attributeData).toBeFalsy();
  });

  it('should parse a line with an attribute and attribute value correctly', () => {
    expect.hasAssertions();
    const line = 'ssrc:1234567 foo:bar';
    const result = SsrcLine.fromSdpLine(line);

    expect(result).toBeTruthy();
    expect(result?.ssrcId).toBe(1234567);
    expect(result?.attribute).toBe('foo');
    expect(result?.attributeValue).toBe('bar');
    expect(result?.attributeData).toBeFalsy();
  });

  it('should parse a line with an attribute, attribute value, and attribute data correctly', () => {
    expect.hasAssertions();
    const line = 'ssrc:1234567 foo:bar baz';
    const result = SsrcLine.fromSdpLine(line);

    expect(result).toBeTruthy();
    expect(result?.ssrcId).toBe(1234567);
    expect(result?.attribute).toBe('foo');
    expect(result?.attributeValue).toBe('bar');
    expect(result?.attributeData).toBe('baz');
  });

  it('should fail to parse invalid lines', () => {
    expect.hasAssertions();

    expect(SsrcLine.fromSdpLine('foo:1234567 foo')).toBeFalsy();
    expect(SsrcLine.fromSdpLine('ssrc:1234567 foo=bar')).toBeFalsy();
  });

  it('should serialize correctly', () => {
    expect.hasAssertions();
    expect(new SsrcLine(1234567, 'foo').toSdpLine()).toBe('a=ssrc:1234567 foo');
    expect(new SsrcLine(1234567, 'foo', 'bar').toSdpLine()).toBe('a=ssrc:1234567 foo:bar');
    expect(new SsrcLine(1234567, 'foo', 'bar', 'baz').toSdpLine()).toBe(
      'a=ssrc:1234567 foo:bar baz'
    );
  });
});
