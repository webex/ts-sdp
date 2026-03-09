import { FmtpLine, PayloadTypeRef, RtcpFbLine, RtpMapLine } from '../lines';
import { CodecInfo } from './codec-info';
import { CodecStore } from './codec-store';

describe('codecStore', () => {
  let store: CodecStore;

  beforeEach(() => {
    store = new CodecStore();
    store.set(96, new CodecInfo(96));
    store.set(97, new CodecInfo(97));
  });

  describe('basic map operations', () => {
    it('should get a codec by pt', () => {
      expect.hasAssertions();
      expect(store.get(96)).toBeDefined();
      expect(store.get(96)?.pt).toBe(96);
    });

    it('should check if a codec exists', () => {
      expect.hasAssertions();
      expect(store.has(96)).toBe(true);
      expect(store.has(99)).toBe(false);
    });

    it('should delete a codec', () => {
      expect.hasAssertions();
      store.delete(96);
      expect(store.has(96)).toBe(false);
    });

    it('should iterate with forEach', () => {
      expect.hasAssertions();
      const pts: number[] = [];
      store.forEach((codec) => pts.push(codec.pt));
      expect(pts).toContain(96);
      expect(pts).toContain(97);
    });

    it('should return values', () => {
      expect.hasAssertions();
      const pts = [...store.values()].map((c) => c.pt);
      expect(pts).toContain(96);
      expect(pts).toContain(97);
    });

    it('should return entries', () => {
      expect.hasAssertions();
      const entries = [...store.entries()];
      expect(entries).toHaveLength(2);
      expect(entries.find(([pt]) => pt === 96)).toBeDefined();
    });
  });

  describe('payloadTypeExists', () => {
    it('should return true for a known numeric payload type', () => {
      expect.hasAssertions();
      expect(store.payloadTypeExists(new PayloadTypeRef(96))).toBe(true);
    });

    it('should return false for an unknown numeric payload type', () => {
      expect.hasAssertions();
      expect(store.payloadTypeExists(new PayloadTypeRef(99))).toBe(false);
    });

    it('should return true for a wildcard payload type', () => {
      expect.hasAssertions();
      expect(store.payloadTypeExists(new PayloadTypeRef('*'))).toBe(true);
    });
  });

  describe('addLine', () => {
    it('should route a numeric RtcpFbLine to the correct codec', () => {
      expect.hasAssertions();
      store.addLine(new RtcpFbLine(new PayloadTypeRef(96), 'nack'));
      expect(store.get(96)?.feedback).toContain('nack');
      expect(store.get(97)?.feedback).not.toContain('nack');
    });

    it('should route a wildcard RtcpFbLine to wildcard feedback', () => {
      expect.hasAssertions();
      store.addLine(new RtcpFbLine(new PayloadTypeRef('*'), 'goog-remb'));
      expect(store.getFeedback(96)).toContain('goog-remb');
      expect(store.getFeedback(97)).toContain('goog-remb');
    });

    it('should store wildcard feedback separately from per-codec feedback', () => {
      expect.hasAssertions();
      store.addLine(new RtcpFbLine(new PayloadTypeRef('*'), 'nack'));
      expect(store.get(96)?.feedback).not.toContain('nack');
      expect(store.get(97)?.feedback).not.toContain('nack');
    });

    it('should route an RtpMapLine to the correct codec', () => {
      expect.hasAssertions();
      store.addLine(new RtpMapLine(new PayloadTypeRef(96), 'VP8', 90000));
      expect(store.get(96)?.name).toBe('VP8');
    });

    it('should route an FmtpLine to the correct codec', () => {
      expect.hasAssertions();
      store.addLine(new FmtpLine(new PayloadTypeRef(96), new Map([['apt', '97']])));
      expect(store.get(96)?.fmtParams.get('apt')).toBe('97');
    });

    it('should throw for an unknown numeric payload type', () => {
      expect.hasAssertions();
      expect(() => store.addLine(new RtcpFbLine(new PayloadTypeRef(99), 'nack'))).toThrow(
        /unknown codec/
      );
    });

    it('should throw for a wildcard non-RtcpFbLine', () => {
      expect.hasAssertions();
      expect(() => store.addLine(new RtpMapLine(new PayloadTypeRef('*'), 'VP8', 90000))).toThrow(
        /wildcard/i
      );
    });

    it('should apply wildcard feedback to codecs added after the wildcard line', () => {
      expect.hasAssertions();
      store.addLine(new RtcpFbLine(new PayloadTypeRef('*'), 'goog-remb'));
      store.set(100, new CodecInfo(100));
      expect(store.getFeedback(100)).toContain('goog-remb');
    });
  });

  describe('getFeedback', () => {
    it('should return per-codec feedback', () => {
      expect.hasAssertions();
      store.addLine(new RtcpFbLine(new PayloadTypeRef(96), 'nack'));
      expect(store.getFeedback(96)).toContain('nack');
      expect(store.getFeedback(97)).not.toContain('nack');
    });

    it('should include wildcard feedback for any codec', () => {
      expect.hasAssertions();
      store.addLine(new RtcpFbLine(new PayloadTypeRef('*'), 'goog-remb'));
      expect(store.getFeedback(96)).toContain('goog-remb');
      expect(store.getFeedback(97)).toContain('goog-remb');
    });

    it('should merge per-codec and wildcard feedback', () => {
      expect.hasAssertions();
      store.addLine(new RtcpFbLine(new PayloadTypeRef(96), 'nack'));
      store.addLine(new RtcpFbLine(new PayloadTypeRef('*'), 'goog-remb'));
      const fb = store.getFeedback(96);
      expect(fb).toContain('nack');
      expect(fb).toContain('goog-remb');
    });
  });

  describe('removeFeedback', () => {
    it('should remove feedback from all codecs and wildcard', () => {
      expect.hasAssertions();
      store.addLine(new RtcpFbLine(new PayloadTypeRef(96), 'nack'));
      store.addLine(new RtcpFbLine(new PayloadTypeRef('*'), 'nack'));
      store.removeFeedback('nack');
      expect(store.getFeedback(96)).not.toContain('nack');
      expect(store.getFeedback(97)).not.toContain('nack');
    });
  });

  describe('toLines', () => {
    it('should emit per-codec lines from codec info', () => {
      expect.hasAssertions();
      store.addLine(new RtcpFbLine(new PayloadTypeRef(96), 'nack'));
      const lines = store.toLines();
      const fbLines = lines.filter((l) => l instanceof RtcpFbLine);
      expect(fbLines).toHaveLength(1);
      expect(fbLines[0].toSdpLine()).toBe('a=rtcp-fb:96 nack');
    });

    it('should emit wildcard feedback as rtcp-fb:* lines', () => {
      expect.hasAssertions();
      store.addLine(new RtcpFbLine(new PayloadTypeRef('*'), 'goog-remb'));
      const lines = store.toLines();
      const fbLines = lines.filter((l) => l instanceof RtcpFbLine);
      expect(fbLines).toHaveLength(1);
      expect(fbLines[0].toSdpLine()).toBe('a=rtcp-fb:* goog-remb');
    });
  });
});
