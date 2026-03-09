import { FmtpLine, Line, PayloadTypeRef, RtcpFbLine, RtpMapLine } from '../lines';
import { CodecInfo } from './codec-info';

/**
 * A store for codec information that handles wildcard rtcp-fb feedback.
 * Wildcard feedback (rtcp-fb:*) applies to all codecs and is stored separately
 * from per-codec feedback, preserving the wildcard semantics through round-trips.
 */
export class CodecStore {
  private codecs: Map<number, CodecInfo> = new Map();

  private wildcardFeedback: string[] = [];

  /**
   * Get the CodecInfo for the given payload type.
   *
   * @param pt - The payload type.
   * @returns The CodecInfo, or undefined if not found.
   */
  get(pt: number): CodecInfo | undefined {
    return this.codecs.get(pt);
  }

  /**
   * Set a CodecInfo for the given payload type.
   *
   * @param pt - The payload type.
   * @param codec - The CodecInfo to store.
   */
  set(pt: number, codec: CodecInfo) {
    this.codecs.set(pt, codec);
  }

  /**
   * Check if a codec exists for the given payload type.
   *
   * @param pt - The payload type.
   * @returns True if a codec exists for this payload type.
   */
  has(pt: number): boolean {
    return this.codecs.has(pt);
  }

  /**
   * Delete the codec for the given payload type.
   *
   * @param pt - The payload type.
   */
  delete(pt: number) {
    this.codecs.delete(pt);
  }

  /**
   * Iterate over all codecs.
   *
   * @param cb - The callback to invoke for each codec.
   */
  forEach(cb: (codec: CodecInfo, pt: number, map: Map<number, CodecInfo>) => void) {
    this.codecs.forEach(cb);
  }

  /**
   * Get an iterator over all CodecInfo values.
   *
   * @returns An iterator of CodecInfo values.
   */
  values(): IterableIterator<CodecInfo> {
    return this.codecs.values();
  }

  /**
   * Get an iterator over all [pt, CodecInfo] entries.
   *
   * @returns An iterator of entries.
   */
  entries(): IterableIterator<[number, CodecInfo]> {
    return this.codecs.entries();
  }

  /**
   * Check if the given payload type reference is valid. A wildcard is always valid;
   * a numeric payload type is valid if it was defined on the m-line.
   *
   * @param pt - The payload type reference to check.
   * @returns True if the payload type is valid.
   */
  payloadTypeExists(pt: PayloadTypeRef): boolean {
    return pt.isWildcard() || this.codecs.has(pt.value as number);
  }

  /**
   * Add a codec-related line. Validates the payload type exists, then routes
   * wildcard lines to wildcard feedback storage and numeric lines to the
   * appropriate CodecInfo.
   *
   * @param line - The line to add.
   */
  addLine(line: RtpMapLine | FmtpLine | RtcpFbLine) {
    if (!this.payloadTypeExists(line.payloadType)) {
      throw new Error(`Error: got line for unknown codec: ${line.toSdpLine()}`);
    }
    if (line.payloadType.isWildcard()) {
      this.wildcardFeedback.push((line as RtcpFbLine).feedback);
    } else {
      const codec = this.codecs.get(line.payloadType.value as number) as CodecInfo;
      codec.addLine(line);
    }
  }

  /**
   * Get all feedback for a given numeric payload type, including any wildcard feedback.
   *
   * @param pt - The numeric payload type.
   * @returns An array of all feedback strings that apply to this payload type.
   */
  getFeedback(pt: number): string[] {
    const codec = this.codecs.get(pt);
    return [...(codec?.feedback ?? []), ...this.wildcardFeedback];
  }

  /**
   * Remove a feedback value from all codecs and from wildcard feedback.
   *
   * @param feedback - The feedback value to remove.
   */
  removeFeedback(feedback: string) {
    this.codecs.forEach((codec) => {
      // eslint-disable-next-line no-param-reassign
      codec.feedback = codec.feedback.filter((fb) => fb !== feedback);
    });
    this.wildcardFeedback = this.wildcardFeedback.filter((fb) => fb !== feedback);
  }

  /**
   * Serialize all codec info and wildcard feedback to SDP lines.
   *
   * @returns An array of Lines.
   */
  toLines(): Line[] {
    const lines: Line[] = [];
    this.codecs.forEach((codec) => lines.push(...codec.toLines()));
    this.wildcardFeedback.forEach((fb) => {
      lines.push(new RtcpFbLine(new PayloadTypeRef('*'), fb));
    });
    return lines;
  }
}
