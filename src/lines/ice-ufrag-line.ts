import {TOKEN} from "../regex-helpers";
import {Line} from "./line";

export class IceUfragLine extends Line {
    ufrag: string;

    private static regex = new RegExp(`^ice-ufrag:(${TOKEN})$`);

    constructor(ufrag: string) {
        super();
        this.ufrag = ufrag;
    }

    static fromSdpLine(line: string): IceUfragLine | undefined {
        if (!IceUfragLine.regex.test(line)) {
            return undefined;
        }
        const tokens = line.match(IceUfragLine.regex) as RegExpMatchArray;
        const ufrag = tokens[1];

        return new IceUfragLine(ufrag);
    }

    toSdpLine(): string {
        return `a=ice-ufrag:${this.ufrag}`;
    }
}
