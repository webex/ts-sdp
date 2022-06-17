import { CodecInfo, AvMediaDescription, Sdp } from './model';

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
 * it) from the media blocks in the given SDP.
 *
 * @param sdp - The SDP from which to remove the given codec.
 * @param codecName - The name of the codec to filter.
 */
export function removeCodec(sdp: Sdp, codecName: string) {
  sdp.avMedia.forEach((media: AvMediaDescription) => {
    const codecInfos = [...media.codecs.entries()].filter(
      ([, ci]) => ci.name?.toLowerCase() === codecName.toLowerCase()
    );

    codecInfos.forEach(([pt]) => media.removePt(pt));
  });
}
