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

import { CandidateLine } from './lines';
import { AvMediaDescription, CodecInfo, MediaDescription, Sdp } from './model';

/**
 * Disable an rtcp-fb value from the media blocks in the given SDP or audio/video media description.
 *
 * @param sdpOrAv - The {@link Sdp} or {@link AvMediaDescription} from which to filter an rtcp-fb value.
 * @param rtcpFbValue - The rtcp-fb value to filter.
 */
export function disableRtcpFbValue(sdpOrAv: Sdp | AvMediaDescription, rtcpFbValue: string) {
  const mediaDescriptions = sdpOrAv instanceof Sdp ? sdpOrAv.avMedia : [sdpOrAv];
  mediaDescriptions.forEach((media: AvMediaDescription) => {
    media.codecs.forEach((codec: CodecInfo) => {
      // eslint-disable-next-line no-param-reassign
      codec.feedback = codec.feedback.filter((fb) => fb !== rtcpFbValue);
    });
  });
}

/**
 * Disable REMB from the media blocks in the given SDP or audio/video media description.
 *
 * @param sdpOrAv - The {@link Sdp} or {@link AvMediaDescription} from which to filter REMB.
 */
export function disableRemb(sdpOrAv: Sdp | AvMediaDescription) {
  disableRtcpFbValue(sdpOrAv, 'goog-remb');
}

/**
 * Disable TWCC from the media blocks in the given SDP or audio/video media description.
 *
 * @param sdpOrAv - The {@link Sdp} or {@link AvMediaDescription} from which to filter TWCC.
 */
export function disableTwcc(sdpOrAv: Sdp | AvMediaDescription) {
  disableRtcpFbValue(sdpOrAv, 'transport-cc');
}

/**
 * Remove the codec with the given name (as well as any secondary codecs associated with
 * it) from the media blocks in the given SDP or audio/video media description.
 *
 * @param sdpOrAv - The {@link Sdp} or {@link AvMediaDescription} from which to remove the given codec.
 * @param codecName - The name of the codec to remove.
 */
export function removeCodec(sdpOrAv: Sdp | AvMediaDescription, codecName: string) {
  const mediaDescriptions = sdpOrAv instanceof Sdp ? sdpOrAv.avMedia : [sdpOrAv];
  mediaDescriptions.forEach((media: AvMediaDescription) => {
    const codecInfos = [...media.codecs.entries()].filter(
      ([, ci]) => ci.name?.toLowerCase() === codecName.toLowerCase()
    );
    codecInfos.forEach(([pt]) => media.removePt(pt));
  });
}

/**
 * Retain specific codecs, filtering out unwanted ones from the given SDP or audio/video media
 * description. The provided predicate should take in a single {@link codecInfo}, and only codecs
 * for which the predicate returns true will be retained.
 *
 * Note: Done this way because of a feature that was only recently implemented in all browsers,
 * previously missing in Firefox. You can also use `RTPSender.getCapabilities` and filter those to
 * call with `RTCRtpTransceiver.setCodecPreferences` instead of doing this manually.
 *
 * @param sdpOrAv - The {@link Sdp} or {@link AvMediaDescription} from which to filter codecs.
 * @param predicate - A function used to determine which codecs should be retained.
 * @returns A boolean that indicates if some codecs have been filtered out.
 */
export function retainCodecs(
  sdpOrAv: Sdp | AvMediaDescription,
  predicate: (codecInfo: CodecInfo) => boolean
): boolean {
  const avMediaDescriptions = sdpOrAv instanceof Sdp ? sdpOrAv.avMedia : [sdpOrAv];
  let filtered = false;

  avMediaDescriptions.forEach((av) => {
    av.codecs.forEach((codecInfo) => {
      if (!predicate(codecInfo)) {
        av.removePt(codecInfo.pt);
        filtered = true;
      }
    });
  });

  return filtered;
}

/**
 * Retain specific codecs, filtering out unwanted ones from the given SDP or audio/video media
 * description by codec name.
 *
 * @param sdpOrAv - The {@link Sdp} or {@link AvMediaDescription} from which to filter codecs.
 * @param allowedCodecNames - The names of the codecs that should remain in the SDP.
 * @returns A boolean that indicates if some codecs have been filtered out.
 */
export function retainCodecsByCodecName(
  sdpOrAv: Sdp | AvMediaDescription,
  allowedCodecNames: Array<string>
): boolean {
  const allowedLowerCase = allowedCodecNames.map((s) => s.toLowerCase());

  return retainCodecs(sdpOrAv, (codecInfo) =>
    allowedLowerCase.includes(codecInfo.name?.toLowerCase() as string)
  );
}

/**
 * Retain specific candidates, filtering out unwanted ones from the given SDP or media description.
 * The provided predicate should take in a single {@link CandidateLine}, and only candidates for
 * which the predicate returns true will be retained.
 *
 * @param sdpOrMedia - The {@link Sdp} or {@link MediaDescription} from which to filter candidates.
 * @param predicate - A function used to determine which candidates should be retained.
 * @returns A boolean that indicates if some candidates have been filtered out.
 */
export function retainCandidates(
  sdpOrMedia: Sdp | MediaDescription,
  predicate: (candidate: CandidateLine) => boolean
) {
  const mediaDescriptions = sdpOrMedia instanceof Sdp ? sdpOrMedia.media : [sdpOrMedia];
  let filtered = false;

  mediaDescriptions.forEach((media) => {
    // eslint-disable-next-line no-param-reassign
    media.iceInfo.candidates = media.iceInfo.candidates.filter((candidate) => {
      if (predicate(candidate)) {
        return true;
      }
      filtered = true;
      return false;
    });
  });

  return filtered;
}

/**
 * Retain specific candidates, filtering out unwanted ones from the given SDP or media description
 * by transport type.
 *
 * @param sdpOrMedia - The {@link Sdp} or {@link MediaDescription} from which to filter candidates.
 * @param allowedTransportTypes - The names of the transport types of the candidates that should remain in the SDP.
 * @returns A boolean that indicates if some candidates have been filtered out.
 */
export function retainCandidatesByTransportType(
  sdpOrMedia: Sdp | MediaDescription,
  allowedTransportTypes: Array<string>
) {
  const allowedLowerCase = allowedTransportTypes.map((s) => s.toLowerCase());

  return retainCandidates(sdpOrMedia, (candidate) =>
    allowedLowerCase.includes(candidate.transport.toLowerCase())
  );
}
