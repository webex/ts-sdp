import { ExtMapLine } from './extmap-line';

describe('extmap line', () => {
  it('should parse a line with basic URI correctly', () => {
    expect.hasAssertions();
    const line = 'extmap:1 http://example.com/082005/ext.htm#ttime';
    const result = ExtMapLine.fromSdpLine(line);

    expect(result).toBeTruthy();
    expect(result?.id).toBe(1);
    expect(result?.uri).toBe('http://example.com/082005/ext.htm#ttime');
    expect(result?.direction).toBeUndefined();
    expect(result?.extensionAttributes).toBeUndefined();
    expect(result?.toSdpLine()).toBe('a=extmap:1 http://example.com/082005/ext.htm#ttime');
  });

  it('should parse a line with direction, URI, and extension attributes correctly', () => {
    expect.hasAssertions();
    const line = 'extmap:2/sendrecv http://example.com/082005/ext.htm#xmeta short';
    const result = ExtMapLine.fromSdpLine(line);

    expect(result).toBeTruthy();
    expect(result?.id).toBe(2);
    expect(result?.uri).toBe('http://example.com/082005/ext.htm#xmeta');
    expect(result?.direction).toBe('sendrecv');
    expect(result?.extensionAttributes).toBe('short');
    expect(result?.toSdpLine()).toBe(
      'a=extmap:2/sendrecv http://example.com/082005/ext.htm#xmeta short'
    );
  });
});
