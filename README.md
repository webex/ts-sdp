# ts-sdp

`ts-sdp` is a library which allows for parsing, manipulation, and serialization of SDP.

## Examples

### Parsing

To parse an SDP string, just call the `parse` method.

```typescript
const sdp = parse(sdpOffer);
```

Note: the given SDP string must terminate each line with either `\r`, `\r\n` or `\n`.

### Manipulation

Once parsed, the SDP can be manipulated through its session and media block models. See the [architecture overview](docs/knowledge-base/architecture/ts-sdp-overview.md) for the model graph and ownership boundaries.

There are munging helper functions available in `src/munge.ts`. For example:

```typescript
removeCodec(parsedSdp, 'vp8');
disableRtcpFbValue(parsedSdp, 'goog-remb');
```

### Serialization

When done, the SDP can be serialized to a string like so:

```typescript
const sdpStr = sdp.toString();
```

## Grammar

The library currently contains much of the [RFC 4566 grammar](https://datatracker.ietf.org/doc/html/rfc4566), in addition to some WebRTC-oriented attributes. Any lines without specific parser implementations are preserved by the internal unknown-line fallback.

The grammar is extendable to allow for parsing custom attributes. First, a subclass of `Line` must be defined:

```typescript
class CustomLine extends Line {
  value: number;

  private static regex = /^foo:([0-9]+)$/;

  constructor(value: number) {
    super();
    this.value = value;
  }

  static fromSdpLine(line: string): CustomLine | undefined {
    if (!CustomLine.regex.test(line)) {
      return undefined;
    }

    const tokens = line.match(CustomLine.regex) as RegExpMatchArray;
    const value = parseInt(tokens[1], 10);
    return new CustomLine(value);
  }

  toSdpLine(): string {
    return `a=foo:${this.value}`;
  }
}
```

Then the parser must be added to the grammar under the appropriate `LineType`:

```typescript
DefaultSdpGrammar.addParser('a', CustomLine.fromSdpLine);
// Result will contain a 'CustomLine' instance in whichever SdpBlock the attribute appears.
const result = parse(sdp);
```

Any implementation of `Grammar` can also be passed to the `parse` method:

```typescript
class MyCustomGrammar extends Grammar {
  constructor() {
    super();
    this.addParser('a', CustomLine.fromSdpLine);
  }
}
const myGrammar = new MyCustomGrammar();
const result = parse('a=foo:42\n', myGrammar);
```

## Contributing and AI-assisted development

- Read [AGENTS.md](AGENTS.md) for setup, verified commands, coding conventions, testing boundaries, and AI-agent guidance.
- Follow [docs/contributing/GIT_CONVENTIONS.md](docs/contributing/GIT_CONVENTIONS.md) for branch and commit conventions.
- Start with the [knowledge base](docs/knowledge-base/README.md) for parser, model, package, and release architecture.
