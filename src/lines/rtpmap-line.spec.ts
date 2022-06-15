import { RtpMapLine } from './rtpmap-line';

describe('rtpmap line', () => {
  it('should parse a line without additional encoding parameters correctly', () => {
    expect.hasAssertions();
    const line = 'rtpmap:42 h264/9000';
    const result = RtpMapLine.fromSdpLine(line);

    expect(result).toBeTruthy();
    expect(result?.encodingName).toBe('h264');
    expect(result?.clockRate).toBe(9000);
    expect(result?.encodingParams).toBeUndefined();
  });

  it('should parse a line with additional encoding parameters correctly', () => {
    expect.hasAssertions();
    const line = 'rtpmap:42 opus/48000/2';
    const result = RtpMapLine.fromSdpLine(line);

    expect(result).toBeTruthy();
    expect(result?.encodingName).toBe('opus');
    expect(result?.clockRate).toBe(48000);
    expect(result?.encodingParams).toBe('2');
  });
});
