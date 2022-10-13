/* eslint-disable max-classes-per-file */

import { ANY_NON_WS } from '../regex-helpers';
import { Line } from './line';

/**
 * Represents a single simulcast layer alternative.
 */
export class SimulcastLayer {
  id: string;

  paused: boolean;

  /**
   * Creates a SimulcastLayer from the given values.
   *
   * @param id - The ID.
   * @param paused - Whether or not it's paused.
   */
  constructor(id: string, paused: boolean) {
    this.id = id;
    this.paused = paused;
  }

  /**
   * Serialize to a string.
   *
   * @returns The string form of this class.
   */
  toString(): string {
    return this.paused ? `~${this.id}` : this.id;
  }
}

/**
 * A list of simulcast layer alternatives, where each entry is a list of
 * possible, alternative {@link SimulcastLayer}s.
 */
export class SimulcastLayerList {
  layers: Array<Array<SimulcastLayer>> = [];

  /**
   * Add a layer which has no alternatives.
   *
   * @param layer - The layer to add.
   */
  addLayer(layer: SimulcastLayer) {
    this.layers.push([layer]);
  }

  /**
   * Add a layer consisting of a set of alternatives.
   *
   * @param alternatives - A set of alternatives that this layer is comprised of.
   */
  addLayerWithAlternatives(alternatives: Array<SimulcastLayer>) {
    this.layers.push(alternatives);
  }

  /**
   * Get the number of simulcast layers.
   *
   * @returns The number of simulcast layers.
   */
  get length() {
    return this.layers.length;
  }

  /**
   * Get the array of SimulcastLayer alternatives at the given index.
   *
   * @param index - The index to retrieve.
   * @returns An array of simulcast alternatives, or undefined.
   */
  get(index: number): Array<SimulcastLayer> | undefined {
    return this.layers[index];
  }

  /**
   * Create a SimulcastLayerList from the given string.
   *
   * @param str - The string to parse.
   * @returns A SimulcastLayerList instance or undefined if parsing failed.
   */
  static fromString(str: string): SimulcastLayerList {
    const layerList = new SimulcastLayerList();
    const tokens = str.split(';');
    if (tokens.length === 1 && !tokens[0].trim()) {
      throw new Error('simulcast stream list empty');
    }
    tokens.forEach((token) => {
      if (!token) {
        throw new Error('simulcast layer list empty');
      }
      const ridTokens = token.split(',');
      const layers: Array<SimulcastLayer> = [];
      ridTokens.forEach((ridToken) => {
        if (!ridToken || ridToken === '~') {
          throw new Error('rid empty');
        }
        const paused = ridToken[0] === '~';
        const rid = paused ? ridToken.substring(1) : ridToken;
        layers.push(new SimulcastLayer(rid, paused));
      });
      layerList.addLayerWithAlternatives(layers);
    });

    return layerList;
  }

  /**
   * Serialize to a string.
   *
   * @returns The string form of this class.
   */
  toString(): string {
    return this.layers
      .map((altArray: Array<SimulcastLayer>) => altArray.map((v) => v.toString()).join(','))
      .join(';');
  }
}

/**
 * Simulcast line as defined in https://datatracker.ietf.org/doc/rfc8853/.
 *
 * @example
 * a=simulcast:recv 1;2 send 4
 */
export class SimulcastLine extends Line {
  sendLayers: SimulcastLayerList;

  recvLayers: SimulcastLayerList;

  private static regex = new RegExp(
    `^simulcast:(send|recv) (${ANY_NON_WS})(?: (send|recv) (${ANY_NON_WS}))?`
  );

  /**
   * Create an instance of SimulcastLine from the given values.
   *
   * @param sendLayers - The send layers.
   * @param recvLayers - The receive layers.
   */
  constructor(sendLayers: SimulcastLayerList, recvLayers: SimulcastLayerList) {
    super();
    this.sendLayers = sendLayers;
    this.recvLayers = recvLayers;
  }

  /**
   * Create a SimulcastLine from the given string.
   *
   * @param line - The line to parse.
   * @returns A SimulcastLine instance or undefined if parsing failed.
   */
  static fromSdpLine(line: string): SimulcastLine | undefined {
    if (!SimulcastLine.regex.test(line)) {
      return undefined;
    }
    const tokens = line.match(SimulcastLine.regex) as RegExpMatchArray;
    // Both directions aren't mandatory, check if both directions have been
    // set by checking if the regex groups for the second directory are both
    // truthy. (Note that using tokens.length doesn't work here, because the
    // array contains other values after the possible match groups).
    const bidirectional = tokens[3] && tokens[4];
    const firstDirection = tokens[1];
    const layerList1 = SimulcastLayerList.fromString(tokens[2]);

    let layerList2 = new SimulcastLayerList();
    if (bidirectional) {
      const secondDirection = tokens[3];
      if (firstDirection === secondDirection) {
        return undefined;
      }
      // We don't actually care about the second direction, we'll infer it
      // from the value of the first one.
      layerList2 = SimulcastLayerList.fromString(tokens[4]);
    }
    let sendLayerList: SimulcastLayerList;
    let recvLayerList: SimulcastLayerList;
    if (firstDirection === 'send') {
      sendLayerList = layerList1;
      recvLayerList = layerList2;
    } else {
      sendLayerList = layerList2;
      recvLayerList = layerList1;
    }

    return new SimulcastLine(sendLayerList, recvLayerList);
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    let str = 'a=simulcast:';
    if (this.sendLayers.length) {
      str += `send ${this.sendLayers.toString()}`;
      if (this.recvLayers.length) {
        str += ` `;
      }
    }
    if (this.recvLayers.length) {
      str += `recv ${this.recvLayers.toString()}`;
    }
    return str;
  }
}
