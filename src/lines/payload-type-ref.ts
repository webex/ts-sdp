/**
 * Represents a payload type reference as it appears in SDP attribute lines.
 * Can be either a numeric payload type or a wildcard (*) meaning "all payload types".
 */
export class PayloadTypeRef {
  readonly value: number | '*';

  /**
   * Create a PayloadTypeRef.
   *
   * @param value - A numeric payload type or '*' for wildcard.
   */
  constructor(value: number | '*') {
    this.value = value;
  }

  /**
   * Check if this reference matches the given numeric payload type.
   * A wildcard matches any payload type.
   *
   * @param pt - The numeric payload type to match against.
   * @returns True if this reference matches the given payload type.
   */
  matches(pt: number): boolean {
    return this.value === '*' || this.value === pt;
  }

  /**
   * Check if this is a wildcard reference.
   *
   * @returns True if this is a wildcard reference.
   */
  isWildcard(): boolean {
    return this.value === '*';
  }

  /**
   * Serialize to string.
   *
   * @returns The string representation.
   */
  toString(): string {
    return `${this.value}`;
  }
}
