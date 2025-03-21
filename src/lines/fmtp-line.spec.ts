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
  it('special case', async () => {
    expect.hasAssertions();
    let fmtpParams = parseFmtpParams('a=fmtp:121 0/5');
    expect(Object.fromEntries(fmtpParams)).toStrictEqual({ '0/5': undefined }); // chrome RED
    fmtpParams = parseFmtpParams('a=fmtp:121 0-5');
    expect(Object.fromEntries(fmtpParams)).toStrictEqual({ '0-5': undefined }); // firefox RED
    fmtpParams = parseFmtpParams('a=fmtp:100 0-15,66,70');
    expect(Object.fromEntries(fmtpParams)).toStrictEqual({ '0-15,66,70': undefined }); // telephone event
    fmtpParams = parseFmtpParams('a=fmtp:45 profile=0;level-idx=19;tier=0;');
    expect(Object.fromEntries(fmtpParams)).toStrictEqual({
      'level-idx': '19',
      profile: '0',
      tier: '0',
    }); // semicolon at the end case
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
