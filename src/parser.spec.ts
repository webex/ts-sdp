import { Line } from './lines/line';
import { DEFAULT_SDP_GRAMMAR, parse } from './parser';
import * as fs from 'fs';

class CustomLine extends Line {
  value: number;

  private static regex = /^foo:([0-9]+)$/;

  constructor(value: number) {
    super();
    this.value = value;
  }

  static fromSdpLine(line: string): CustomLine | undefined {
    if (!CustomLine.regex.test(line)) {
      return undefined;
    }

    const tokens = line.match(CustomLine.regex) as RegExpMatchArray;
    const value = parseInt(tokens[1], 10);
    return new CustomLine(value);
  }

  toSdpLine(): string {
    return `a=foo:${this.value}`;
  }
}

const sdpWithCustom = `v=0
o=- 3510072484341496656 2 IN IP4 127.0.0.1
s=-
t=0 0
m=video 9 UDP/TLS/RTP/SAVPF 96
a=mid:0
a=ice-ufrag:J/UT
a=ice-pwd:4U8uDB4oX2Oa1tM566bbj/wD
a=ice-options:trickle
a=fingerprint:sha-256 EB:06:86:81:9C:4A:13:17:A8:44:A9:BD:3A:82:67:F0:FF:49:41:EE:5D:C2:D2:D4:C0:03:AB:24:13:E7:E9:1B
a=rtpmap:96 VP8/90000
a=rtcp-fb:96 goog-remb
a=rtcp-fb:96 transport-cc
a=rtcp-fb:96 ccm fir
a=rtcp-fb:96 nack
a=rtcp-fb:96 nack pli
a=foo:42
`;

/**
 * Helper function to try and validate that two SDPs match.  We don't enforce that the
 * order is the same, so merely validate that every line in 'actual' has a match in
 * 'expected', and vice versa.
 */
function compareSdps(actual: string, expected: string) {
  const actualLines = actual.split(/\r\n|\n|\r/).filter((l) => l.length);
  const expectedLines = expected.split(/\r\n|\n|\r/).filter((l) => l.length);

  const expectedLinesCopy = [...expectedLines];
  actualLines.forEach((actualLine) => {
    const matchingLineIndex = expectedLinesCopy.indexOf(actualLine);
    if (matchingLineIndex !== -1) {
      expectedLinesCopy.splice(matchingLineIndex, 1);
    } else {
      throw new Error(`Actual line not found in expected sdp: '${actualLine}'`);
    }
  });
  const actualLinesCopy = [...actualLines];
  expectedLines.forEach((expectedLine) => {
    const actualLineIndex = actualLinesCopy.indexOf(expectedLine);
    if (actualLineIndex !== -1) {
      actualLinesCopy.splice(actualLineIndex, 1);
    } else {
      throw new Error(`Expected line not found in actual sdp: '${expectedLine}'`);
    }
  });
  expect(actualLines.length).toBe(expectedLines.length);
}

describe('parsing', () => {
  describe('with a custom grammar', () => {
    var newGrammar = { ...DEFAULT_SDP_GRAMMAR };
    newGrammar.a.push(CustomLine.fromSdpLine);
    it('should parse the custom attribute', () => {
      expect.hasAssertions();
      const parsed = parse(sdpWithCustom, newGrammar);
      const custom = parsed.media[0].otherLines.find(
        (ol): ol is CustomLine => ol instanceof CustomLine
      ) as CustomLine;
      expect(custom).toBeTruthy();
      expect(custom.value).toBe(42);
    });
  });
  describe('chrome default offer', () => {
    it('should parse correctly', () => {
      const file = fs.readFileSync('./src/sdp-corpus/chrome_102_a_v_dc_offer.sdp', 'utf-8');
      const result = parse(file);
      const str = result.toSdp();
      compareSdps(str, file);
    });
  });
  describe('ffox default offer', () => {
    it('should parse correctly', () => {
      const file = fs.readFileSync('./src/sdp-corpus/ffox_101_a_v_dc_offer.sdp', 'utf-8');
      const result = parse(file);
      const str = result.toSdp();
      compareSdps(str, file);
    });
  });
});
