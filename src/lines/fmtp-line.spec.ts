import { parseFmtpParams } from './fmtp-line';

describe('parseFmtpParams', () => {
  it('normal case', async () => {
    expect.hasAssertions();
    const expectedValue = {
      'level-asymmetry-allowed': '1',
      'max-br': '1000000',
      'max-dpb': '63600',
      'packetization-mode': '1',
      'profile-level-id': '420034',
    };
    let fmtpParams = parseFmtpParams(
      'level-asymmetry-allowed=1;max-br=1000000;max-dpb=63600;packetization-mode=1;profile-level-id=420034'
    );
    expect(Object.fromEntries(fmtpParams)).toStrictEqual(expectedValue);
    fmtpParams = parseFmtpParams(
      'a=fmtp:97 level-asymmetry-allowed=1;max-br=1000000;max-dpb=63600;packetization-mode=1;profile-level-id=420034' // real Safari case.
    );
    expect(Object.fromEntries(fmtpParams)).toStrictEqual(expectedValue);
  });
  it('exceptional case', async () => {
    expect.hasAssertions();
    expect(() => {
      parseFmtpParams(
        'level-asymmetry-allowed=1;max-br=1000000max-dpb=63600;packetization-mode=1;profile-level-id=420034' // only lack semicolon
      );
    }).toThrow(Error);
    expect(() => {
      parseFmtpParams(
        'level-asymmetry-allowed=1;max-br=max-dpb=63600;packetization-mode=1;profile-level-id=420034' // lack semicolon and value
      );
    }).toThrow(Error);
    expect(() => {
      parseFmtpParams(
        'level-asymmetry-allowed=1;max-br;max-dpb=63600;packetization-mode=1;profile-level-id=420034' // lack semicolon, value and equals sign
      );
    }).toThrow(Error);
    expect(() => {
      parseFmtpParams(
        'level-asymmetry-allowed=1;max-br=1000000;;max-dpb=63600;packetization-mode=1;profile-level-id=420034' // lack semicolon, value,  equals sign and key
      );
    }).toThrow(Error);
    expect(() => {
      parseFmtpParams(
        'level-asymmetry-allowed=1;max-br=;max-dpb=63600;packetization-mode=1;profile-level-id=420034' //  only lack value
      );
    }).toThrow(Error);
    expect(() => {
      parseFmtpParams(
        'level-asymmetry-allowed=1;max-br;max-dpb=63600;packetization-mode=1;profile-level-id=420034' //  lack value and equals sign
      );
    }).toThrow(Error);
    expect(() => {
      parseFmtpParams(
        'level-asymmetry-allowed=1;=1000000;max-dpb=63600;packetization-mode=1;profile-level-id=420034' //  only lack key
      );
    }).toThrow(Error);
    expect(() => {
      parseFmtpParams(
        'level-asymmetry-allowed=1;=;max-dpb=63600;packetization-mode=1;profile-level-id=420034' //  lack key and value
      );
    }).toThrow(Error);
    expect(() => {
      parseFmtpParams(
        'level-asymmetry-allowed=1;=max-dpb=63600;packetization-mode=1;profile-level-id=420034' //  lack key, value and semicolon
      );
    }).toThrow(Error);
  });
});
