import { RtcpFbLine } from './rtcpfb-line';

describe('rtcpfb line', () => {
  it('should parse a line with a numeric payload type correctly', () => {
    expect.hasAssertions();
    const line = 'rtcp-fb:96 goog-remb';
    const result = RtcpFbLine.fromSdpLine(line);

    expect(result).toBeTruthy();
    expect(result?.payloadType).toBe(96);
    expect(result?.feedback).toBe('goog-remb');
    expect(result?.toSdpLine()).toBe('a=rtcp-fb:96 goog-remb');
  });

  it('should parse a line with wildcard payload type correctly', () => {
    expect.hasAssertions();
    const line = 'rtcp-fb:* ack ccfb';
    const result = RtcpFbLine.fromSdpLine(line);

    expect(result).toBeTruthy();
    expect(result?.payloadType).toBe('*');
    expect(result?.feedback).toBe('ack ccfb');
    expect(result?.toSdpLine()).toBe('a=rtcp-fb:* ack ccfb');
  });

  it('should return undefined for an invalid line', () => {
    expect.hasAssertions();
    const line = 'rtcp-fb:foo bar';
    const result = RtcpFbLine.fromSdpLine(line);

    expect(result).toBeUndefined();
  });
});
