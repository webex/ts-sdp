---
applyTo: 'src/**/*.spec.ts,src/sdp-corpus/**'
name: ts-sdp Tests
description: Use when writing or reviewing co-located Jest tests and SDP corpus fixtures.
---

# Testing Instructions

## Framework and location

- Jest runs through `ts-jest` in the environment configured by `jest.config.js`. Check `package.json` and `jest.config.js` instead of pinning tool versions in guidance.
- Keep tests next to source as `src/**/*.spec.ts`.
- Keep reusable SDP fixtures under `src/sdp-corpus/`.
- Use `yarn test:unit` for focused runtime feedback and `yarn test:coverage` for the pull-request test command.
- Run `yarn transpile:validate` when changing exports, parser types, line classes, model contracts, or munging signatures.

## Test patterns

- Name the top-level `describe` after the line, model, parser flow, or munging behavior under test.
- Use behavior-focused `it('should ...')` descriptions.
- Test both successful parsing and a representative non-match for line parsers.
- Assert `toSdpLine()` output for new or changed line models.
- Use corpus round trips when ordering and preservation across a complete SDP matter.
- Keep tests independent. Avoid mutating `DefaultSdpGrammar` unless the test is specifically verifying global parser registration.
- Use synthetic, non-sensitive SDP values. Never copy real ICE credentials, fingerprints, addresses, or user session captures.

## Required coverage by change type

- Grammar changes: parser order, custom parser behavior, fallback handling, and non-match behavior.
- Line changes: accepted forms, rejected forms, field extraction, and serialization.
- Session or media model changes: `addLine()` routing and `toLines()` ordering.
- Codec changes: numeric and wildcard payload references, codec aggregation, secondary codec relationships, and serialization.
- Munging changes: both `Sdp` and media-description entry points where supported, matching and non-matching cases, and return flags.
- Public type changes: TypeScript validation plus runtime tests where behavior also changes.
- Regression fixes: the smallest fixture or inline SDP that fails before the fix and passes after it.
