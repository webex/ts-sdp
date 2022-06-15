import {REST} from "../regex-helpers";
import {Line} from "./line";

/**
 * Session name as defined by https://datatracker.ietf.org/doc/html/rfc4566#section-5.3.
 *
 * Ex: s=session_name
 */
export class SessionNameLine extends Line {
    name: string;

    private static regex = new RegExp(`^(${REST})`);

    constructor(name: string) {
        super();
        this.name = name;
    }

    static fromSdpLine(line: string): SessionNameLine | undefined {
        if (!SessionNameLine.regex.test(line)) {
            return undefined;
        }
        const tokens = line.match(SessionNameLine.regex) as RegExpMatchArray;
        const name = tokens[1];

        return new SessionNameLine(name);
    }

    toSdpLine(): string {
        return `s=${this.name}`;
    }
}


