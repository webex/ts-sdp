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

import {
  DirectionLine,
  ExtMapDirection,
  ExtMapLine,
  FingerprintLine,
  FmtpLine,
  Line,
  MediaDirection,
  MediaLine,
  MidLine,
  RidLine,
  RtcpFbLine,
  RtcpMuxLine,
  RtpMapLine,
  Setup,
  SetupLine,
  SimulcastLine,
  SsrcGroupLine,
  SsrcLine,
} from '../lines';
import { CodecInfo } from './codec-info';
import { MediaDescription } from './media-description';

/**
 * Describes the length being used for header extension IDs.
 */
export enum HeaderExtIdMode {
  OneByte,
  TwoByte,
  Mixed,
}

/**
 * Model a media description with type 'audio' or 'video'.
 */
export class AvMediaDescription extends MediaDescription {
  pts: Array<number> = [];

  extMaps: Map<number, ExtMapLine> = new Map();

  rids: Array<RidLine> = [];

  simulcast?: SimulcastLine;

  codecs: Map<number, CodecInfo> = new Map();

  direction?: MediaDirection;

  rtcpMux = false;

  ssrcs: Array<SsrcLine> = [];

  ssrcGroups: Array<SsrcGroupLine> = [];

  /**
   * Create a MediaInfo instance from a MediaLine.
   *
   * @param mediaLine - The MediaLine to create this MediaInfo from.
   */
  constructor(mediaLine: MediaLine) {
    super(mediaLine.type, mediaLine.port, mediaLine.protocol);
    this.pts = mediaLine.formats.map((fmt) => {
      return parseInt(fmt, 10);
    });
    this.pts.forEach((pt) => this.codecs.set(pt, new CodecInfo(pt)));
  }

  /**
   * @inheritdoc
   */
  toLines(): Array<Line> {
    const lines: Array<Line> = [];
    lines.push(
      new MediaLine(
        this.type,
        this.port,
        this.protocol,
        this.pts.map((pt) => `${pt}`)
      )
    );
    if (this.connection) {
      lines.push(this.connection);
    }
    if (this.bandwidth) {
      lines.push(this.bandwidth);
    }
    lines.push(...this.iceInfo.toLines());
    if (this.fingerprint) {
      lines.push(new FingerprintLine(this.fingerprint as string));
    }
    if (this.setup) {
      lines.push(new SetupLine(this.setup as Setup));
    }
    if (this.mid) {
      lines.push(new MidLine(this.mid));
    }
    if (this.rtcpMux) {
      lines.push(new RtcpMuxLine());
    }
    if (this.content) {
      lines.push(this.content);
    }
    this.extMaps.forEach((extMap) => lines.push(extMap));
    this.rids.forEach((rid) => lines.push(rid));
    if (this.simulcast) {
      lines.push(this.simulcast);
    }
    if (this.direction) {
      lines.push(new DirectionLine(this.direction as MediaDirection));
    }
    this.codecs.forEach((codec) => lines.push(...codec.toLines()));

    lines.push(...this.ssrcs);
    lines.push(...this.ssrcGroups);

    lines.push(...this.otherLines);

    return lines;
  }

  /**
   * @inheritdoc
   */
  addLine(line: Line): boolean {
    if (super.addLine(line)) {
      return true;
    }
    if (line instanceof MediaLine) {
      throw new Error('Error: tried passing a MediaLine to an existing MediaInfo');
    }
    if (line instanceof DirectionLine) {
      this.direction = line.direction;
      return true;
    }
    if (line instanceof ExtMapLine) {
      if (this.extMaps.has(line.id)) {
        throw new Error(
          `Tried to extension with duplicate ID: an extension already exists with ID ${line.id}`
        );
      }
      this.extMaps.set(line.id, line);
      return true;
    }
    if (line instanceof RidLine) {
      this.rids.push(line);
      return true;
    }
    if (line instanceof RtcpMuxLine) {
      this.rtcpMux = true;
      return true;
    }
    if (line instanceof SimulcastLine) {
      this.simulcast = line;
      return true;
    }
    // Lines pertaining to a specific codec
    if (line instanceof RtpMapLine || line instanceof FmtpLine || line instanceof RtcpFbLine) {
      const codec = this.codecs.get(line.payloadType);
      if (!codec) {
        throw new Error(`Error: got line for unknown codec: ${line.toSdpLine()}`);
      }
      codec.addLine(line);
      return true;
    }
    if (line instanceof SsrcLine) {
      this.ssrcs.push(line);
      return true;
    }
    if (line instanceof SsrcGroupLine) {
      this.ssrcGroups.push(line);
      return true;
    }
    this.otherLines.push(line);
    return true;
  }

  /**
   * Get the CodecInfo associated with the given payload type, if one exists.
   *
   * @param pt - The payload type.
   * @returns The corresponding CodecInfo, or undefined if none was found.
   */
  getCodecByPt(pt: number): CodecInfo | undefined {
    return this.codecs.get(pt);
  }

  /**
   * Remove all references to the given payload type.  This includes removing any secondary codecs
   * that may be associated with this payload type.
   *
   * @param pt - The payload type of the codec to remove.
   */
  removePt(pt: number) {
    const associatedPts = [...this.codecs.values()]
      .filter((ci: CodecInfo) => ci.primaryCodecPt === pt)
      .map((ci: CodecInfo) => ci.pt);
    const allPtsToRemove = [pt, ...associatedPts];
    allPtsToRemove.forEach((ptToRemove: number) => {
      this.codecs.delete(ptToRemove);
    });
    this.pts = this.pts.filter((existingPt) => allPtsToRemove.indexOf(existingPt) === -1);
  }

  /**
   * Add the given extension to this mline.
   *
   * @param extInfo - Information related to the extension to be added.
   * @param extInfo.uri - The URI of the extension.
   * @param extInfo.direction - An optional direction for the extension.
   * @param extInfo.attributes - Option attributes for the extension.
   * @param extInfo.id - An optional ID to use for the extension.  If no ID is passed, the first
   * free (not already present in the map) ID will be used, starting at 1.  If the ID is
   * invalid or already in use, an error is thrown.
   */
  addExtension({
    uri,
    direction,
    attributes,
    id,
  }: {
    uri: string;
    direction?: ExtMapDirection;
    attributes?: string;
    id?: number;
  }) {
    // eslint-disable-next-line jsdoc/require-jsdoc
    const getFirstFreeId = (): number => {
      const inUseIds = [...this.extMaps.keys()].sort();
      for (let idx = 0; idx < inUseIds.length; idx += 1) {
        if (inUseIds[idx] !== idx + 1) {
          return idx + 1;
        }
      }
      // No 'gaps' in the IDs currently in use, so return the next number
      return inUseIds.length + 1;
    };

    const extId = id || getFirstFreeId();
    if (this.extMaps.has(extId)) {
      throw new Error(`Extension with ID ${id} already exists`);
    }
    if (extId === 0) {
      throw new Error(`Extension ID 0 is reserved`);
    }
    this.extMaps.set(extId, new ExtMapLine(extId, uri, direction, attributes));
  }
}
