import {TOKEN} from "../regex-helpers";
import {Line} from "./line";

export class MidLine extends Line {
    mid: string;

    private static regex = new RegExp(`^mid:(${TOKEN})$`);

    constructor(mid: string) {
        super();
        this.mid = mid;
    }

    static fromSdpLine(line: string): MidLine | undefined {
        if (!MidLine.regex.test(line)) {
            return undefined;
        }
        const tokens = line.match(MidLine.regex) as RegExpMatchArray;
        const mid = tokens[1];

        return new MidLine(mid);
    }

    toSdpLine(): string {
        return `a=mid:${this.mid}`;
    }
}
