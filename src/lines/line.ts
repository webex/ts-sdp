export abstract class Line {
  /**
   * Return this line as an SDP string.
   *
   * @return This line as an SDP string.
   */
  abstract toSdpLine(): string;
}
