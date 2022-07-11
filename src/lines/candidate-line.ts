import { NUM, REST, TOKEN } from '../regex-helpers';
import { Line } from './line';

/**
 * Model a candidate line from an SDP as defined by https://datatracker.ietf.org/doc/html/rfc8839#section-5.1.
 *
 * @example
 * a=candidate:2 1 UDP 1694498815 192.0.2.3 45664 typ srflx raddr 203.0.113.141 rport 8998
 */
export class CandidateLine extends Line {
  foundation: string;

  componentId: number;

  transport: string;

  priority: number;

  connectionAddress: string;

  port: number;

  candidateType: string;

  relAddr?: string;

  relPort?: number;

  candidateExtensions?: string;

  private static ICE_CHARS = `[a-zA-Z0-9+/]+`;

  private static regex = new RegExp(
    `^candidate:(${this.ICE_CHARS}) (${NUM}) (${TOKEN}) (${NUM}) (${TOKEN}) (${NUM}) typ (${TOKEN})(?: raddr (${TOKEN}))?(?: rport (${NUM}))?(?: (${REST}))?`
  );

  /**
   * Create a CandidateLine from the given values.
   *
   * @param foundation - An identifier for the candidate.
   * @param componentId - Identifies the specific component of the data stream for which this is a candidate.
   * @param transport - The transport protocol for the candidate.
   * @param priority - The candidate's priority.
   * @param connectionAddress - The IP address of the candidate.
   * @param port - The port of the candidate.
   * @param candidateType - The type of candidate.
   * @param relAddr - The transport address related to the candidate.
   * @param relPort - The transport port related to the candidate.
   * @param candidateExtensions - Extensions for the candidate.
   */
  constructor(
    foundation: string,
    componentId: number,
    transport: string,
    priority: number,
    connectionAddress: string,
    port: number,
    candidateType: string,
    relAddr?: string,
    relPort?: number,
    candidateExtensions?: string
  ) {
    super();
    this.foundation = foundation;
    this.componentId = componentId;
    this.transport = transport;
    this.priority = priority;
    this.connectionAddress = connectionAddress;
    this.port = port;
    this.candidateType = candidateType;
    this.relAddr = relAddr;
    this.relPort = relPort;
    this.candidateExtensions = candidateExtensions;
  }

  /**
   * Create a CandidateLine from the given string.
   *
   * @param line - The line to parse.
   * @returns A CandidateLine instance or undefined if parsing failed.
   */
  static fromSdpLine(line: string): CandidateLine | undefined {
    if (!CandidateLine.regex.test(line)) {
      return undefined;
    }
    const tokens = line.match(CandidateLine.regex) as RegExpMatchArray;
    const foundation = tokens[1];
    const componentId = parseInt(tokens[2], 10);
    const transport = tokens[3];
    const priority = parseInt(tokens[4], 10);
    const connectionAddress = tokens[5];
    const port = parseInt(tokens[6], 10);
    const candidateType = tokens[7];
    const relAddr = tokens[8];
    const relPort = tokens[9] ? parseInt(tokens[9], 10) : undefined;
    const candidateExtensions = tokens[10];

    return new CandidateLine(
      foundation,
      componentId,
      transport,
      priority,
      connectionAddress,
      port,
      candidateType,
      relAddr,
      relPort,
      candidateExtensions
    );
  }

  /**
   * @inheritdoc
   */
  toSdpLine(): string {
    let str = '';
    str += `a=candidate:${this.foundation} ${this.componentId} ${this.transport} ${this.priority} ${this.connectionAddress} ${this.port} typ ${this.candidateType}`;
    if (this.relAddr) {
      str += ` raddr ${this.relAddr}`;
    }
    if (this.relPort) {
      str += ` rport ${this.relPort}`;
    }
    if (this.candidateExtensions) {
      str += ` ${this.candidateExtensions}`;
    }
    return str;
  }
}
