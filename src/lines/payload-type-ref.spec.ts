import { PayloadTypeRef } from './payload-type-ref';

describe('payloadTypeRef', () => {
  describe('numeric', () => {
    it('should store a numeric value', () => {
      expect.hasAssertions();
      const pt = new PayloadTypeRef(96);
      expect(pt.value).toBe(96);
    });

    it('should not be a wildcard', () => {
      expect.hasAssertions();
      const pt = new PayloadTypeRef(96);
      expect(pt.isWildcard()).toBe(false);
    });

    it('should match the same numeric value', () => {
      expect.hasAssertions();
      const pt = new PayloadTypeRef(96);
      expect(pt.matches(96)).toBe(true);
    });

    it('should not match a different numeric value', () => {
      expect.hasAssertions();
      const pt = new PayloadTypeRef(96);
      expect(pt.matches(97)).toBe(false);
    });

    it('should serialize to string as the number', () => {
      expect.hasAssertions();
      const pt = new PayloadTypeRef(96);
      expect(pt.toString()).toBe('96');
    });
  });

  describe('wildcard', () => {
    it('should store the wildcard value', () => {
      expect.hasAssertions();
      const pt = new PayloadTypeRef('*');
      expect(pt.value).toBe('*');
    });

    it('should be a wildcard', () => {
      expect.hasAssertions();
      const pt = new PayloadTypeRef('*');
      expect(pt.isWildcard()).toBe(true);
    });

    it('should match any numeric value', () => {
      expect.hasAssertions();
      const pt = new PayloadTypeRef('*');
      expect(pt.matches(96)).toBe(true);
      expect(pt.matches(0)).toBe(true);
      expect(pt.matches(127)).toBe(true);
    });

    it('should serialize to string as *', () => {
      expect.hasAssertions();
      const pt = new PayloadTypeRef('*');
      expect(pt.toString()).toBe('*');
    });
  });
});
