import {CodecInfo, MediaInfo} from 'model';
import {disableRemb, removeCodec} from './munge';
import { parse } from './parser';

const input = `v=1
o=jdoe 1234 1 IN IP4 127.0.0.1
m=video 9 UDP/TLS/RTP/SAVPF 127 121 96 97
a=extmap:1 urn:ietf:params:rtp-hdrext:toffset
a=extmap:2 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time
a=extmap:3 urn:3gpp:video-orientation
a=extmap:4 http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01
a=extmap:5 http://www.webrtc.org/experiments/rtp-hdrext/playout-delay
a=mid:1
a=sendrecv
a=rtcp-fb:127 goog-remb
a=rtcp-fb:127 transport-cc
a=rtcp-fb:127 ccm fir
a=rtcp-fb:127 nack
a=rtcp-fb:127 nack pli
a=rtpmap:127 H264/90000
a=fmtp:127 level-asymmetry-allowed_1;packetization-mode=1;profile-level-id=42001f
a=rtpmap:121 rtx/90000
a=fmtp:121 apt=127
a=rtpmap:96 VP8/90000
a=rtcp-fb:96 goog-remb
a=rtcp-fb:96 transport-cc
a=rtcp-fb:96 ccm fir
a=rtcp-fb:96 nack
a=rtcp-fb:96 nack pli
a=rtpmap:97 rtx/90000
a=fmtp:97 apt=96
`;

describe('parsing', () => {
  it('should work', () => {
    const result = parse(input);
    console.log(result.toSdp());
    disableRemb(result);

    console.log(result.toSdp());
    removeCodec(result, 'vp8');
    console.log(result.toSdp());

  });
});
