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

export const inputMediaDescription = `m=audio 9 UDP/TLS/RTP/SAVPF 111 63 103 104 9 0 8 106 105 13 110 112 113 126\r
c=IN IP4 0.0.0.0\r
a=rtcp:9 IN IP4 0.0.0.0\r
a=ice-ufrag:N+Ad\r
a=ice-pwd:ifFo2Y+XyKPsJe3Bpkw5lb0J\r
a=ice-options:trickle\r
a=fingerprint:sha-256 41:60:0F:AC:A5:EA:EB:E2:22:3E:75:E5:47:BF:C4:36:57:6E:BB:38:D6:50:BC:1E:FF:42:1F:5D:B9:17:DF:12\r
a=setup:actpass\r
a=mid:0\r
a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level\r
a=extmap:2 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r
a=extmap:3 http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01\r
a=extmap:4 urn:ietf:params:rtp-hdrext:sdes:mid\r
a=sendrecv\r
a=msid:- a8a17466-0c31-4198-bbd1-20fb6ca2fac6\r
a=rtcp-mux\r
a=rtpmap:111 opus/48000/2\r
a=rtcp-fb:111 transport-cc\r
a=fmtp:111 minptime=10;useinbandfec=1\r
a=rtpmap:63 red/48000/2\r
a=fmtp:63 111/111\r
a=rtpmap:103 ISAC/16000\r
a=rtpmap:104 ISAC/32000\r
a=rtpmap:9 G722/8000\r
a=rtpmap:0 PCMU/8000\r
a=rtpmap:8 PCMA/8000\r
a=rtpmap:106 CN/32000\r
a=rtpmap:105 CN/16000\r
a=rtpmap:13 CN/8000\r
a=rtpmap:110 telephone-event/48000\r
a=rtpmap:112 telephone-event/32000\r
a=rtpmap:113 telephone-event/16000\r
a=rtpmap:126 telephone-event/8000\r
a=ssrc:4013544331 cname:OfAxmTLksFb12Jj3\r
a=ssrc:4013544331 msid:- a8a17466-0c31-4198-bbd1-20fb6ca2fac6\r
a=ssrc:4013544331 mslabel:-\r
a=ssrc:4013544331 label:a8a17466-0c31-4198-bbd1-20fb6ca2fac6\r
`;

// The expected result after parsing and serializing the input
export const expectedOutputMediaDescription = `m=audio 9 UDP/TLS/RTP/SAVPF 111 63 103 104 9 0 8 106 105 13 110 112 113 126\r
c=IN IP4 0.0.0.0\r
a=ice-ufrag:N+Ad\r
a=ice-pwd:ifFo2Y+XyKPsJe3Bpkw5lb0J\r
a=ice-options:trickle\r
a=fingerprint:sha-256 41:60:0F:AC:A5:EA:EB:E2:22:3E:75:E5:47:BF:C4:36:57:6E:BB:38:D6:50:BC:1E:FF:42:1F:5D:B9:17:DF:12\r
a=setup:actpass\r
a=mid:0\r
a=rtcp-mux\r
a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level\r
a=extmap:2 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r
a=extmap:3 http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01\r
a=extmap:4 urn:ietf:params:rtp-hdrext:sdes:mid\r
a=sendrecv\r
a=rtpmap:111 opus/48000/2\r
a=rtcp-fb:111 transport-cc\r
a=fmtp:111 minptime=10;useinbandfec=1\r
a=rtpmap:63 red/48000/2\r
a=fmtp:63 111/111\r
a=rtpmap:103 ISAC/16000\r
a=rtpmap:104 ISAC/32000\r
a=rtpmap:9 G722/8000\r
a=rtpmap:0 PCMU/8000\r
a=rtpmap:8 PCMA/8000\r
a=rtpmap:106 CN/32000\r
a=rtpmap:105 CN/16000\r
a=rtpmap:13 CN/8000\r
a=rtpmap:110 telephone-event/48000\r
a=rtpmap:112 telephone-event/32000\r
a=rtpmap:113 telephone-event/16000\r
a=rtpmap:126 telephone-event/8000\r
a=ssrc:4013544331 cname:OfAxmTLksFb12Jj3\r
a=ssrc:4013544331 msid:- a8a17466-0c31-4198-bbd1-20fb6ca2fac6\r
a=ssrc:4013544331 mslabel:-\r
a=ssrc:4013544331 label:a8a17466-0c31-4198-bbd1-20fb6ca2fac6\r
a=rtcp:9 IN IP4 0.0.0.0\r
a=msid:- a8a17466-0c31-4198-bbd1-20fb6ca2fac6\r
`;
