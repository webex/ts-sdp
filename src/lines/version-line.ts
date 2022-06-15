import {NUM} from "../regex-helpers";
import {Line} from "./line";

/**
 * Definition of a version as defined by https://datatracker.ietf.org/doc/html/rfc4566#section-5.1
 *
 * Ex: v=0
 */
export class VersionLine extends Line {
    version: number;
    private static regex: RegExp = new RegExp(`^(${NUM})$`);

    constructor(version: number) {
        super();
        this.version = version;
    }

    static fromSdpLine(line: string): VersionLine | undefined {
        if (!VersionLine.regex.test(line)) {
            return undefined;
        }
        const tokens = line.match(VersionLine.regex) as RegExpMatchArray;
        const version = parseInt(tokens[1]);
        return new VersionLine(version);
    }

    toSdpLine(): string {
        return `v=${this.version}`;
    }
}
