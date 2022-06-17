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
