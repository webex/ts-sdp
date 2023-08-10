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

import { AvMediaDescription, CodecInfo, MediaDescription, Sdp } from './model';

/**
 * Disable an rtcp-fb value from all media blocks in the given SDP.
 *
 * @param sdp - The SDP from which to filter an rtcp-fb value.
 * @param rtcpFbValue - The rtcp-fb value to filter.
 */
export function disableRtcpFbValue(sdp: Sdp, rtcpFbValue: string) {
  sdp.avMedia.forEach((media: AvMediaDescription) => {
    media.codecs.forEach((codec: CodecInfo) => {
      // eslint-disable-next-line no-param-reassign
      codec.feedback = codec.feedback.filter((fb) => fb !== rtcpFbValue);
    });
  });
}

/**
 * Disable REMB from all media blocks in the given SDP.
 *
 * @param sdp - The SDP from which to filter REMB.
 */
export function disableRemb(sdp: Sdp) {
  disableRtcpFbValue(sdp, 'goog-remb');
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
 * description.
 *
 * Note: Done this way because of a feature not implemented in all browsers, currently missing in
 * Firefox. Once that is added we can use `RTPSender.getCapabilities` and filter those to call
 * with `RTCRtpTransceiver.setCodecPreferences` instead of doing this manually.
 *
 * @param sdpOrAv - The {@link Sdp} or {@link AvMediaDescription} from which to filter codecs.
 * @param allowedCodecNames - The names of the codecs that should remain in the SDP.
 */
export function retainCodecs(
  sdpOrAv: Sdp | AvMediaDescription,
  allowedCodecNames: Array<string>
): void {
  const avMediaDescriptions = sdpOrAv instanceof Sdp ? sdpOrAv.avMedia : [sdpOrAv];
  const allowedLowerCase = allowedCodecNames.map((s) => s.toLowerCase());

  avMediaDescriptions
    .map((av) => {
      return [...av.codecs.values()].map((c) => c.name as string);
    })
    .flat()
    .filter((codecName) => !allowedLowerCase.includes(codecName.toLowerCase()))
    .forEach((unwantedCodec) => removeCodec(sdpOrAv, unwantedCodec));
}

/**
 * Retain specific candidates, filtering out unwanted ones from the given SDP or media description
 * by transport type.
 *
 * @param sdpOrMedia - The {@link Sdp} or {@link MediaDescription} from which to filter candidates.
 * @param allowedTransportTypes - The names of the transport types of the candidates that should remain in the SDP.
 * @returns A boolean that indicates if some candidates have been filtered out.
 */
export function retainCandidates(
  sdpOrMedia: Sdp | MediaDescription,
  allowedTransportTypes: Array<string>
) {
  const mediaDescriptions = sdpOrMedia instanceof Sdp ? sdpOrMedia.media : [sdpOrMedia];
  let filtered = false;

  mediaDescriptions.forEach((media) => {
    // eslint-disable-next-line no-param-reassign
    media.iceInfo.candidates = media.iceInfo.candidates.filter((candidate) => {
      if (allowedTransportTypes.includes(candidate.transport.toLowerCase())) {
        return true;
      }
      filtered = true;
      return false;
    });
  });

  return filtered;
}
