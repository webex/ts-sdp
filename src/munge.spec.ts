import * as fs from 'fs';
import { CandidateLine } from 'lines';
import { AvMediaDescription, CodecInfo, Sdp } from './model';
import {
  disableRemb,
  disableRtcpFbValue,
  disableTwcc,
  removeCodec,
  retainCandidates,
  retainCandidatesByTransportType,
  retainCodecs,
  retainCodecsByCodecName,
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

      // eslint-disable-next-line jsdoc/require-jsdoc
      const predicate = (codecInfo: CodecInfo) =>
        codecInfo.name === 'h264' || codecInfo.name === 'opus';

      // should return true when some codecs have been filtered out
      expect(retainCodecs(parsed, predicate)).toBeTruthy();
      expect(validateOfferCodecs(parsed)).toBe(true);
      // should return false when no codecs have been filtered out
      expect(retainCodecs(parsed, predicate)).toBeFalsy();
    });
    it('should retain codecs correctly when passing in an AvMediaDescription', () => {
      expect.hasAssertions();
      const offer = fs.readFileSync('./src/sdp-corpus/offer_with_extra_codecs.sdp', 'utf-8');
      const parsed = parse(offer);

      // eslint-disable-next-line jsdoc/require-jsdoc
      const predicate = (codecInfo: CodecInfo) =>
        codecInfo.name === 'h264' || codecInfo.name === 'opus';

      // should return true when some codecs have been filtered out
      parsed.avMedia.forEach((av) => {
        expect(retainCodecs(av, predicate)).toBeTruthy();
      });
      expect(validateOfferCodecs(parsed)).toBe(true);
      // should return false when no codecs have been filtered out
      parsed.avMedia.forEach((av) => {
        expect(retainCodecs(av, predicate)).toBeFalsy();
      });
    });
    it('should retain codecs by name when passing in an SDP', () => {
      expect.hasAssertions();
      const offer = fs.readFileSync('./src/sdp-corpus/offer_with_extra_codecs.sdp', 'utf-8');
      const parsed = parse(offer);

      // should return true when some codecs have been filtered out
      expect(retainCodecsByCodecName(parsed, ['h264', 'opus'])).toBeTruthy();
      expect(validateOfferCodecs(parsed)).toBe(true);
      // should return false when no codecs have been filtered out
      expect(retainCodecsByCodecName(parsed, ['h264', 'opus'])).toBeFalsy();
    });
    it('should retain codecs by name when passing in an AvMediaDescription', () => {
      expect.hasAssertions();
      const offer = fs.readFileSync('./src/sdp-corpus/offer_with_extra_codecs.sdp', 'utf-8');
      const parsed = parse(offer);

      // should return true when some codecs have been filtered out
      parsed.avMedia.forEach((av) => {
        expect(retainCodecsByCodecName(av, ['h264', 'opus'])).toBeTruthy();
      });
      expect(validateOfferCodecs(parsed)).toBe(true);
      // should return false when no codecs have been filtered out
      parsed.avMedia.forEach((av) => {
        expect(retainCodecsByCodecName(av, ['h264', 'opus'])).toBeFalsy();
      });
    });
  });

  describe('retainCandidates', () => {
    it('should retain candidates correctly when passing in an SDP', () => {
      expect.hasAssertions();
      const offer = fs.readFileSync('./src/sdp-corpus/answer_with_extra_candidates.sdp', 'utf-8');
      const parsed = parse(offer);

      // eslint-disable-next-line jsdoc/require-jsdoc
      const predicate = (candidate: CandidateLine) =>
        candidate.transport === 'UDP' || candidate.transport === 'TCP';

      // should return true when some candidates have been filtered out
      expect(retainCandidates(parsed, predicate)).toBeTruthy();
      parsed.media.forEach((mline) => {
        expect(mline.iceInfo.candidates).toHaveLength(4);
        expect(
          mline.iceInfo.candidates.every((candidate) =>
            ['UDP', 'TCP'].includes(candidate.transport)
          )
        ).toBeTruthy();
      });
      // should return false when no candidates have been filtered out
      expect(retainCandidates(parsed, predicate)).toBeFalsy();
    });
    it('should retain candidates correctly when passing in a MediaDescription', () => {
      expect.hasAssertions();
      const offer = fs.readFileSync('./src/sdp-corpus/answer_with_extra_candidates.sdp', 'utf-8');
      const parsed = parse(offer);

      // eslint-disable-next-line jsdoc/require-jsdoc
      const predicate = (candidate: CandidateLine) =>
        candidate.transport === 'UDP' || candidate.transport === 'TCP';

      parsed.media.forEach((media) => {
        // should return true when some candidates have been filtered out
        expect(retainCandidates(media, predicate)).toBeTruthy();
        expect(media.iceInfo.candidates).toHaveLength(4);
        expect(
          media.iceInfo.candidates.every((candidate) =>
            ['UDP', 'TCP'].includes(candidate.transport)
          )
        ).toBeTruthy();
        // should return false when no candidates have been filtered out
        expect(retainCandidates(media, predicate)).toBeFalsy();
      });
    });
    it('should retain candidates by transport type when passing in an SDP', () => {
      expect.hasAssertions();
      const offer = fs.readFileSync('./src/sdp-corpus/answer_with_extra_candidates.sdp', 'utf-8');
      const parsed = parse(offer);

      // should return true when some candidates have been filtered out
      expect(retainCandidatesByTransportType(parsed, ['UDP', 'TCP'])).toBeTruthy();
      parsed.media.forEach((mline) => {
        expect(mline.iceInfo.candidates).toHaveLength(4);
        expect(
          mline.iceInfo.candidates.every((candidate) =>
            ['UDP', 'TCP'].includes(candidate.transport)
          )
        ).toBeTruthy();
      });
      // should return false when no candidates have been filtered out
      expect(retainCandidatesByTransportType(parsed, ['UDP', 'TCP'])).toBeFalsy();
    });
    it('should retain candidates by transport type when passing in a MediaDescription', () => {
      expect.hasAssertions();
      const offer = fs.readFileSync('./src/sdp-corpus/answer_with_extra_candidates.sdp', 'utf-8');
      const parsed = parse(offer);

      parsed.media.forEach((media) => {
        // should return true when some candidates have been filtered out
        expect(retainCandidatesByTransportType(media, ['UDP', 'TCP'])).toBeTruthy();
        expect(media.iceInfo.candidates).toHaveLength(4);
        expect(
          media.iceInfo.candidates.every((candidate) =>
            ['UDP', 'TCP'].includes(candidate.transport)
          )
        ).toBeTruthy();
        // should return false when no candidates have been filtered out
        expect(retainCandidatesByTransportType(media, ['UDP', 'TCP'])).toBeFalsy();
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
