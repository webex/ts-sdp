/**
 * Models a line from an SDP.
 */
export abstract class Line {
  /**
   * Return this line as an SDP string.
   *
   * @returns This line as an SDP string.
   */
  abstract toSdpLine(): string;
}
