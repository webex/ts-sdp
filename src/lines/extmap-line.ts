import {NUM, REST} from "../regex-helpers";
import {Line} from "./line";

export class ExtMapLine extends Line {
    id: number;
    uri: string;

    private static regex = new RegExp(`^extmap:(${NUM}) (${REST})`);

    constructor(id: number, uri: string) {
        super();
        this.id = id;
        this.uri = uri;
    }

    static fromSdpLine(line: string): ExtMapLine | undefined {
        if (!ExtMapLine.regex.test(line)) {
            return undefined;
        }
        const tokens = line.match(ExtMapLine.regex) as RegExpMatchArray;
        const id =  parseInt(tokens[1]);
        const uri = tokens[2];

        return new ExtMapLine(id, uri);
    }

    toSdpLine(): string {
        return `a=extmap:${this.id} ${this.uri}`;
    }
}
