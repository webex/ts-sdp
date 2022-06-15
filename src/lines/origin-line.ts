import {NUM, TOKEN} from "../regex-helpers";
import {Line} from "./line";

/**
 * Definition of an origin line as defined by https://datatracker.ietf.org/doc/html/rfc4566#section-5.2
 *
 * Ex: o=- 3510072484341496656 2 IN IP4 127.0.0.1
 */
export class OriginLine extends Line {
    username: string;
    sessionId: number;
    sessionVersion: number;
    netType: string;
    addrType: string;
    ipAddr: string;

    private static regex: RegExp = new RegExp(`^(${TOKEN}) (${NUM}) (${NUM}) (${TOKEN}) (${TOKEN}) (${TOKEN})`);

    constructor(
            username: string,
            sessionId: number,
            sessionVersion: number,
            netType: string,
            addrType: string,
            ipAddr: string
    ) {
        super();
        this.username = username;
        this.sessionId = sessionId;
        this.sessionVersion = sessionVersion;
        this.netType = netType;
        this.addrType = addrType;
        this.ipAddr = ipAddr;
    }

    static fromSdpLine(line: string): OriginLine | undefined {
        if (!OriginLine.regex.test(line)) {
            return undefined;
        }
        const tokens = line.match(OriginLine.regex) as RegExpMatchArray;
        const username = tokens[1];
        const sessionId = parseInt(tokens[2]);
        const sessionVersion = parseInt(tokens[3]);
        const netType  = tokens[4];
        const addrType = tokens[5];
        const ipAddr = tokens[6];
        return new OriginLine(
            username,
            sessionId,
            sessionVersion,
            netType,
            addrType,
            ipAddr
        );
    }

    toSdpLine(): string {
        return `o=${this.username} ${this.sessionId} ${this.sessionVersion} ${this.netType} ${this.addrType} ${this.ipAddr}`;
    }
}
