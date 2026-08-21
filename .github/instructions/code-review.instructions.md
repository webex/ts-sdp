---
applyTo: 'src/**/*.ts,README.md,AGENTS.md,docs/knowledge-base/**/*.md'
name: ts-sdp Code Review
description: Use when reviewing SDP parsing, models, munging, public exports, tests, or architecture guidance.
---

# Code Review Instructions

## Priorities

1. Supported and unsupported SDP lines continue to parse and serialize without accidental data loss.
2. Parser registration order and custom `Grammar` extensions remain deterministic.
3. Lines route to the correct session, media, ICE, codec, or fallback collection.
4. Munging helpers keep payload references, secondary codecs, wildcard feedback, and media scope consistent.
5. Changes to `src/index.ts`, exported signatures, accepted syntax, output ordering, errors, package entry points, or declarations include compatibility and semantic-version analysis.
6. Protocol edge cases have focused line tests, model tests, or corpus-based round-trip coverage.

## Checks

- Each `Line` parser returns `undefined` for non-matches and emits a complete line from `toSdpLine()`.
- New line parsers are registered under the correct line type and in an intentional order.
- Unknown lines and custom line types remain available through `otherLines` and survive serialization.
- Session-level and media-level fields serialize in the order defined by their model's `toLines()`.
- Audio/video and application media behavior remains separated where their models differ.
- Codec lines validate numeric or wildcard payload references through `CodecStore`.
- Codec removal handles associated secondary payload types, and feedback changes cover per-codec and wildcard storage.
- Public export changes are intentional and documented.
- JSDoc remains complete where ESLint requires it. Comments explain protocol constraints or surprising behavior rather than restating code.
- Documentation claims are verified against source, tests, package metadata, build configuration, and release configuration.
- Test SDP contains no real ICE credentials, network identifiers, fingerprints, or other sensitive session data.
- No secrets, credentials, private URLs, certificates, `.env` values, or local absolute paths appear in the diff.
