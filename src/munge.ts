import { CodecInfo, MediaInfo, Sdp } from './model';

/**
 * Disable REMB from all media blocks in the given SDP.
 *
 * @param sdp - The SDP from which to filter REMB.
 */
export function disableRemb(sdp: Sdp) {
  disableRtcpFbValue(sdp, 'goog-remb');
}

/**
 * Disable an rtcp-fb value from all media blocks in the given SDP.
 *
 * @param sdp - The SDP from which to filter an rtcp-fb value.
 * @param rtcpFbValue - The rtcp-fb value to filter.
 */
export function disableRtcpFbValue(sdp: Sdp, rtcpFbValue: string) {
  sdp.media.forEach((media: MediaInfo) => {
    media.codecs.forEach((codec: CodecInfo) => {
      codec.feedback = codec.feedback.filter((fb) => fb !== rtcpFbValue);
    });
  });
}

/**
 * Remove the codec with the given name (as well as any secondary codecs associated with
 * it) from the media blocks in the given SDP.
 *
 * @param sdp - The SDP from which to remove the given codec.
 * @param codecName - The name of the codec to filter.
 */
export function removeCodec(sdp: Sdp, codecName: string) {
  sdp.media.forEach((media: MediaInfo) => {
    const codecInfos = [...media.codecs.entries()].filter(
      ([, ci]) => ci.name?.toLowerCase() === codecName.toLowerCase()
    );

    codecInfos.forEach(([pt]) => media.removePt(pt));
  });
}
