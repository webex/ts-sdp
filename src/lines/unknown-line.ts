import {REST} from "../regex-helpers";
import {Line} from "./line";

export class UnknownLine extends Line {
    value: string;

    private static regex = new RegExp(`(${REST})`);

    constructor(value: string) {
        super();
        this.value = value;
    }

    static fromSdpLine(line: string): UnknownLine {
        console.log("trying to parse line as unknown attr line: ", line);
        const tokens = line.match(UnknownLine.regex) as RegExpMatchArray;

        const value = tokens[1];

        return new UnknownLine(value);
    }

    toSdpLine(): string {
        return `a=${this.value}`;
    }
}
