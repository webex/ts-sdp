import * as fs from 'fs';
import { AvMediaDescription, CodecInfo, Sdp } from './model';
import {
  removeCodec,
  retainCandidates,
  retainCodecs,
  disableRtcpFbValue,
  disableRemb,
  disableTwcc,
} from './munge';
import { parse } from './parser';

/**
 * Validate that the sdp offer does not use any video codecs besides h264 or opus.
 *
 * @param offer - The sdp offer string to validate.
 * @returns True if the offer is valid.
 */
const validateOfferCodecs = (offer: Sdp): boolean => {
  offer.avMedia
    .filter((av: AvMediaDescription) => av.type === 'video')
    .forEach((av: AvMediaDescription) => {
      [...av.codecs.values()].forEach((c: CodecInfo) => {
        if (c.name?.toLowerCase() !== 'h264') {
          throw new Error('SDP contains non-h264 codec in video media description');
        }
      });
    });
  offer.avMedia
    .filter((av: AvMediaDescription) => av.type === 'audio')
    .forEach((av: AvMediaDescription) => {
      [...av.codecs.values()].forEach((c: CodecInfo) => {
        if (c.name?.toLowerCase() !== 'opus') {
          throw new Error('SDP contains non-opus codec in audio media description');
        }
      });
    });
  return true;
};

/**
 * Check that the sdp offer contains rtcpFbValue or not.
 *
 * @param offer - The {@link Sdp} or {@link AvMediaDescription} to validate.
 * @param rtcpFbValue - The rtcp-fb value to check.
 * @returns True if the offer contains rtcp-fb value.
 */
const checkOfferContainsRtcpFeedback = (
  offer: Sdp | AvMediaDescription,
  rtcpFbValue: string
): boolean => {
  const mediaDescriptions = offer instanceof Sdp ? offer.avMedia : [offer];
  return mediaDescriptions.some((av: AvMediaDescription) => {
    return [...av.codecs.values()].some((ci: CodecInfo) => {
      return ci.feedback.includes(rtcpFbValue);
    });
  });
};

describe('munging', () => {
  describe('removeCodec', () => {
    it('should remove codecs correctly when passing in an SDP', () => {
      expect.hasAssertions();
      const offer = fs.readFileSync('./src/sdp-corpus/offer_with_extra_codecs.sdp', 'utf-8');
      const parsed = parse(offer);

      const unwantedVideoCodecs = ['VP8', 'VP9', 'AV1', 'rtx', 'red', 'ulpfec'];
      const unwantedAudioCodecs = ['red', 'ISAC', 'G722', 'PCMU', 'PCMA', 'CN', 'telephone-event'];

      unwantedVideoCodecs.forEach((codec) => removeCodec(parsed, codec));
      unwantedAudioCodecs.forEach((codec) => removeCodec(parsed, codec));
      expect(validateOfferCodecs(parsed)).toBe(true);
    });
    it('should remove codecs correctly when passing in an AvMediaDescription', () => {
      expect.hasAssertions();
      const offer = fs.readFileSync('./src/sdp-corpus/offer_with_extra_codecs.sdp', 'utf-8');
      const parsed = parse(offer);

      const unwantedVideoCodecs = ['VP8', 'VP9', 'AV1', 'rtx', 'red', 'ulpfec'];
      const unwantedAudioCodecs = ['red', 'ISAC', 'G722', 'PCMU', 'PCMA', 'CN', 'telephone-event'];

      parsed.avMedia.forEach((av) => {
        unwantedVideoCodecs.forEach((codec) => removeCodec(av, codec));
        unwantedAudioCodecs.forEach((codec) => removeCodec(av, codec));
      });
      expect(validateOfferCodecs(parsed)).toBe(true);
    });
  });
  describe('retainCodecs', () => {
    it('should retain codecs correctly when passing in an SDP', () => {
      expect.hasAssertions();
      const offer = fs.readFileSync('./src/sdp-corpus/offer_with_extra_codecs.sdp', 'utf-8');
      const parsed = parse(offer);

      retainCodecs(parsed, ['h264', 'opus']);
      expect(validateOfferCodecs(parsed)).toBe(true);
    });
    it('should retain codecs correctly when passing in an AvMediaDescription', () => {
      expect.hasAssertions();
      const offer = fs.readFileSync('./src/sdp-corpus/offer_with_extra_codecs.sdp', 'utf-8');
      const parsed = parse(offer);

      parsed.avMedia.forEach((av) => {
        retainCodecs(av, ['h264', 'opus']);
      });
      expect(validateOfferCodecs(parsed)).toBe(true);
    });
  });

  describe('retainCandidates', () => {
    it('should retain candidates correctly when passing in an SDP', () => {
      expect.hasAssertions();
      const offer = fs.readFileSync('./src/sdp-corpus/answer_with_extra_candidates.sdp', 'utf-8');
      const parsed = parse(offer);

      // should return true when some candidates have been filtered out
      expect(retainCandidates(parsed, ['udp', 'tcp'])).toBeTruthy();
      parsed.media.forEach((mline) => {
        expect(mline.iceInfo.candidates).toHaveLength(4);
        expect(
          mline.iceInfo.candidates.every((candidate) =>
            ['udp', 'tcp'].includes(candidate.transport.toLowerCase())
          )
        ).toBeTruthy();
      });
      // should return false when no candidates have been filtered out
      expect(retainCandidates(parsed, ['udp', 'tcp'])).toBeFalsy();
    });
    it('should retain candidates correctly when passing in an AvMediaDescription', () => {
      expect.hasAssertions();
      const offer = fs.readFileSync('./src/sdp-corpus/answer_with_extra_candidates.sdp', 'utf-8');
      const parsed = parse(offer);

      parsed.media.forEach((media) => {
        // should return true when some candidates have been filtered out
        expect(retainCandidates(media, ['udp', 'tcp'])).toBeTruthy();
        expect(media.iceInfo.candidates).toHaveLength(4);
        expect(
          media.iceInfo.candidates.every((candidate) =>
            ['udp', 'tcp'].includes(candidate.transport.toLowerCase())
          )
        ).toBeTruthy();
        // should return false when no candidates have been filtered out
        expect(retainCandidates(media, ['udp', 'tcp'])).toBeFalsy();
      });
    });
  });

  describe('disableRtcpFbValue', () => {
    it('should remove rtcp feedback correctly when passing in an SDP', () => {
      expect.hasAssertions();
      const offer = fs.readFileSync('./src/sdp-corpus/offer_with_rtcp_feedback.sdp', 'utf-8');
      const parsed = parse(offer);

      disableRtcpFbValue(parsed, 'transport-cc');
      expect(checkOfferContainsRtcpFeedback(parsed, 'transport-cc')).toBe(false);
      expect(checkOfferContainsRtcpFeedback(parsed, 'goog-remb')).toBe(true);
    });
    it('should remove rtcp feedback correctly when passing in an AvMediaDescription', () => {
      expect.hasAssertions();
      const offer = fs.readFileSync('./src/sdp-corpus/offer_with_rtcp_feedback.sdp', 'utf-8');
      const parsed = parse(offer);

      parsed.avMedia
        .filter((av) => av.type === 'audio')
        .forEach((av) => {
          disableRtcpFbValue(av, 'transport-cc');
          expect(checkOfferContainsRtcpFeedback(av, 'transport-cc')).toBe(false);
        });
      expect(checkOfferContainsRtcpFeedback(parsed, 'transport-cc')).toBe(true);
      expect(checkOfferContainsRtcpFeedback(parsed, 'goog-remb')).toBe(true);
    });
  });

  describe('disableTwcc', () => {
    it('should disable twcc when passing in an SDP', () => {
      expect.hasAssertions();
      const offer = fs.readFileSync('./src/sdp-corpus/offer_with_rtcp_feedback.sdp', 'utf-8');
      const parsed = parse(offer);

      disableTwcc(parsed);
      expect(checkOfferContainsRtcpFeedback(parsed, 'transport-cc')).toBe(false);
      expect(checkOfferContainsRtcpFeedback(parsed, 'goog-remb')).toBe(true);
    });
    it('should disable twcc when passing in an AvMediaDescription', () => {
      expect.hasAssertions();
      const offer = fs.readFileSync('./src/sdp-corpus/offer_with_rtcp_feedback.sdp', 'utf-8');
      const parsed = parse(offer);

      parsed.avMedia
        .filter((av) => av.type === 'audio')
        .forEach((av) => {
          disableTwcc(av);
          expect(checkOfferContainsRtcpFeedback(av, 'transport-cc')).toBe(false);
        });
      expect(checkOfferContainsRtcpFeedback(parsed, 'transport-cc')).toBe(true);
      expect(checkOfferContainsRtcpFeedback(parsed, 'goog-remb')).toBe(true);
    });
  });

  describe('disableRemb', () => {
    it('should disable remb when passing in an SDP', () => {
      expect.hasAssertions();
      const offer = fs.readFileSync('./src/sdp-corpus/offer_with_rtcp_feedback.sdp', 'utf-8');
      const parsed = parse(offer);

      disableRemb(parsed);
      expect(checkOfferContainsRtcpFeedback(parsed, 'goog-remb')).toBe(false);
      expect(checkOfferContainsRtcpFeedback(parsed, 'transport-cc')).toBe(true);
    });
    it('should disable remb when passing in an AvMediaDescription', () => {
      expect.hasAssertions();
      const offer = fs.readFileSync('./src/sdp-corpus/offer_with_rtcp_feedback.sdp', 'utf-8');
      const parsed = parse(offer);

      parsed.avMedia
        .filter((av) => av.type === 'video')
        .forEach((av) => {
          disableRemb(av);
          expect(checkOfferContainsRtcpFeedback(av, 'goog-remb')).toBe(false);
        });
      expect(checkOfferContainsRtcpFeedback(parsed, 'goog-remb')).toBe(false);
      expect(checkOfferContainsRtcpFeedback(parsed, 'transport-cc')).toBe(true);
    });
  });
});
