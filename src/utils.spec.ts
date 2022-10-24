import { MediaLine, RtpMapLine } from './lines';
import { AvMediaDescription } from './model';
import { hasCodec } from './utils';

describe('hasCodec', () => {
  it('should return true only if the codec is present', () => {
    expect.hasAssertions();
    const mLine = new AvMediaDescription(
      new MediaLine('video', 9, 'UDP/TLS/RTP/SAVPF', ['96', '97', '98', '99', '100', '101', '127'])
    );
    mLine.addLine(new RtpMapLine(96, 'h264', 9000));

    expect(hasCodec('h264', mLine)).toBe(true);
    expect(hasCodec('H264', mLine)).toBe(true);
    expect(hasCodec('vp8', mLine)).toBe(false);
  });
});
