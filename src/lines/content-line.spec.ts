import { ContentLine } from './content-line';

describe('content line', () => {
  it('should parse multiple values correctly', () => {
    expect.hasAssertions();
    const line = 'content:slides,powerpoint,screenShare';
    const result = ContentLine.fromSdpLine(line);

    expect(result).toBeTruthy();
    expect(result?.values).toStrictEqual(['slides', 'powerpoint', 'screenShare']);
  });
  it('should not parse a line with no values', () => {
    expect.hasAssertions();
    const line = 'content:';
    const result = ContentLine.fromSdpLine(line);

    expect(result).toBeUndefined();
  });
  describe('toSdpLine()', () => {
    it('works correctly', () => {
      expect.assertions(1);
      const contentLine = new ContentLine(['abc', 'def']);

      expect(contentLine.toSdpLine()).toBe('a=content:abc,def');
    });
  });
});
