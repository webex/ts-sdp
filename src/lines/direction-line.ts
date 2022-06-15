import {Line} from "./line";

export type MediaDirection = 'sendrecv' | 'sendonly' | 'recvonly' | 'inactive';

/**
 * Definition of a direction attribute line as defined in https://datatracker.ietf.org/doc/html/rfc4566#section-6
 *
 * Ex: a=sendrecv
 */
export class DirectionLine extends Line {
    direction: MediaDirection;

    private static regex: RegExp = new RegExp(`(sendrecv|sendonly|recvonly|inactive)`);

    constructor(direction: MediaDirection) {
        super();
        this.direction = direction;
    }

    static fromSdpLine(line: string): DirectionLine | undefined {
        if (!DirectionLine.regex.test(line)) {
            return undefined;
        }
        const tokens = line.match(DirectionLine.regex) as RegExpMatchArray;
        const direction = tokens[1] as MediaDirection;

        return new DirectionLine(direction);
    }

    toSdpLine(): string {
        return `a=${this.direction}`;
    }

}
