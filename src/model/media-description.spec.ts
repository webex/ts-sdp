import { parse } from '../parser';
import { expectedOutputMediaDescription, inputMediaDescription } from '../sdp-corpus/ordering';

describe('media description', () => {
  it('should put the lines in the correct order', () => {
    expect.hasAssertions();
    const sdp = parse(inputMediaDescription);
    const result = sdp.toString();

    expect(result).toBe(expectedOutputMediaDescription);
  });
});
