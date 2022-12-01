/*
 * Copyright 2022 Cisco
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
