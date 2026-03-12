import { RtcpFbLine } from './rtcpfb-line';

describe('rtcpFbLine', () => {
  describe('fromSdpLine', () => {
    it('should parse a numeric payload type', () => {
      expect.hasAssertions();
      const line = RtcpFbLine.fromSdpLine('rtcp-fb:96 goog-remb');
      expect(line).toBeDefined();
      expect(line?.payloadType.value).toBe(96);
      expect(line?.payloadType.isWildcard()).toBe(false);
      expect(line?.feedback).toBe('goog-remb');
    });

    it('should parse a wildcard payload type', () => {
      expect.hasAssertions();
      const line = RtcpFbLine.fromSdpLine('rtcp-fb:* nack');
      expect(line).toBeDefined();
      expect(line?.payloadType.value).toBe('*');
      expect(line?.payloadType.isWildcard()).toBe(true);
      expect(line?.feedback).toBe('nack');
    });

    it('should parse a wildcard payload type with compound feedback', () => {
      expect.hasAssertions();
      const line = RtcpFbLine.fromSdpLine('rtcp-fb:* nack pli');
      expect(line).toBeDefined();
      expect(line?.payloadType.value).toBe('*');
      expect(line?.feedback).toBe('nack pli');
    });

    it('should return undefined for invalid line', () => {
      expect.hasAssertions();
      const line = RtcpFbLine.fromSdpLine('rtcp-fb:abc nack');
      expect(line).toBeUndefined();
    });
  });

  describe('toSdpLine', () => {
    it('should serialize a numeric payload type', () => {
      expect.hasAssertions();
      const line = RtcpFbLine.fromSdpLine('rtcp-fb:96 goog-remb');
      expect(line?.toSdpLine()).toBe('a=rtcp-fb:96 goog-remb');
    });

    it('should serialize a wildcard payload type', () => {
      expect.hasAssertions();
      const line = RtcpFbLine.fromSdpLine('rtcp-fb:* nack pli');
      expect(line?.toSdpLine()).toBe('a=rtcp-fb:* nack pli');
    });
  });
});
