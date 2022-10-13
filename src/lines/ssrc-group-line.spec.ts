import { SsrcGroupLine } from './ssrc-group-line';

describe('ssrc group line', () => {
  it('should parse valid lines correctly', () => {
    expect.hasAssertions();
    {
      const line = 'ssrc-group:SIM 123 456 789';
      const result = SsrcGroupLine.fromSdpLine(line);

      expect(result).toBeTruthy();
      expect(result?.semantics).toBe('SIM');
      expect(result?.ssrcs).toStrictEqual([123, 456, 789]);
    }
    {
      const line = 'ssrc-group:FID 123 456';
      const result = SsrcGroupLine.fromSdpLine(line);

      expect(result).toBeTruthy();
      expect(result?.semantics).toBe('FID');
      expect(result?.ssrcs).toStrictEqual([123, 456]);
    }
  });

  it('should fail to parse invalid lines', () => {
    expect.hasAssertions();

    expect(SsrcGroupLine.fromSdpLine('foo:FID 123 456')).toBeFalsy();
    expect(SsrcGroupLine.fromSdpLine('ssrc-group:BAR 123 456')).toBeFalsy();
    expect(SsrcGroupLine.fromSdpLine('ssrc-group:FID abc def')).toBeFalsy();
  });

  it('should serialize correctly', () => {
    expect.hasAssertions();

    expect(new SsrcGroupLine('SIM', [123, 456, 789]).toSdpLine()).toBe(
      'a=ssrc-group:SIM 123 456 789'
    );
    expect(new SsrcGroupLine('FID', [123, 456]).toSdpLine()).toBe('a=ssrc-group:FID 123 456');
  });
});
