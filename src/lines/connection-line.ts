import {TOKEN} from "../regex-helpers";
import {Line} from "./line";

/**
 * Definition of a connection description as defined by https://datatracker.ietf.org/doc/html/rfc4566#section-5.7
 *
 * Ex: c=IN IP4 0.0.0.0
 */
export class ConnectionLine extends Line {
    netType: string;
    addrType: string;
    ipAddr: string;

    private static regex: RegExp = new RegExp(`^(${TOKEN}) (${TOKEN}) (${TOKEN})`);

    constructor(
        netType: string,
        addrType: string,
        ipAddr: string
    ) {
        super();
        this.netType = netType;
        this.addrType = addrType;
        this.ipAddr = ipAddr;
    }

    static fromSdpLine(line: string): ConnectionLine | undefined {
        if (!ConnectionLine.regex.test(line)) {
            return undefined;
        }
        const tokens = line.match(ConnectionLine.regex) as RegExpMatchArray;
        const netType = tokens[1];
        const addrType = tokens[2];
        const ipAddr = tokens[3];

        return new ConnectionLine(netType, addrType, ipAddr);
    }

    toSdpLine(): string {
        return `c=${this.netType} ${this.addrType} ${this.ipAddr}`;
    }
}
