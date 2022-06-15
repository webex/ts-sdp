import { parse } from './parser';

const input = `v=1
o=jdoe 1234 1 IN IP4 127.0.0.1
m=video 9 UDP/TLS/RTP/SAVPF 127
a=sendrecv
a=rtcp-fb:127 goog-remb
a=rtcp-fb:127 transport-cc
a=rtcp-fb:127 ccm fir
a=rtcp-fb:127 nack
a=rtcp-fb:127 nack pli
a=rtpmap:127 H264/90000
a=fmtp:127 level-asymmetry-allowed_1;packetization-mode=1;profile-level-id=42001f
`;

describe('parsing', () => {
  it('should work', () => {
    const result = parse(input);
    console.log(result.toSdp());
  });
});
