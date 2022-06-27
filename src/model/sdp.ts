import { Line } from '../lines';
import { AvMediaDescription } from './av-media-description';
import { MediaDescription } from './media-description';
import { SessionDescription } from './session-description';

/**
 * Models an entire SDP: a session block and 0 or more media blocks.
 */
export class Sdp {
  session: SessionDescription = new SessionDescription();

  media: Array<MediaDescription> = [];

  /**
   * A helper property to retrieve just audio/video media info blocks.
   *
   * @returns Any AvMediaDescriptions in this SDP.
   */
  get avMedia() {
    return this.media.filter<AvMediaDescription>(
      (mi: MediaDescription): mi is AvMediaDescription => mi instanceof AvMediaDescription
    );
  }

  /**
   * Convert this Sdp object to an SDP string.
   *
   * @returns This SDP as a string.
   */
  toString(): string {
    const lines: Array<Line> = [];
    lines.push(...this.session.toLines());
    this.media.forEach((m) => lines.push(...m.toLines()));

    return `${lines.map((l) => l.toSdpLine()).join('\r\n')}\r\n`;
  }
}
