# AGENTS.md

## Project Overview

`@webex/ts-sdp` is a public TypeScript library for parsing, manipulating, and serializing Session Description Protocol (SDP). It provides typed models and helpers for working with session and media descriptions.

Start with [README.md](README.md) for usage and [docs/knowledge-base/README.md](docs/knowledge-base/README.md) for architecture, public boundaries, build outputs, testing, and release behavior.

## General Guidelines

- Be direct, analytical, and evidence-based.
- Derive behavior from `src/`, co-located tests, SDP corpus fixtures, and checked-in configuration.
- Treat `src/index.ts` as the public source export boundary and `package.json` as the authority for package entry points and runtime dependencies.
- Read the knowledge base before broad architecture searches.
- When guidance conflicts, current source and repository configuration win.

## Agent Rules

1. Cite repository paths, config keys, tests, or stable public links for factual claims.
2. Use public sources only. Do not add private issue links, documentation hosts, consumer chains, or enterprise-only skills.
3. Never commit secrets, credentials, private keys, certificate material, or decrypted `.env` content.
4. Do not add absolute local paths to committed files.
5. Create commits or push changes only when the user explicitly asks.

### Committing files

- Stage explicit paths only. Do not use `git add .` or `git add -A`.
- Stage only files changed for the current task.
- Before committing, inspect `git status` and the staged diff for secrets, keys, certificates, local paths, generated output, or unrelated changes.

### Knowledge base

The curated knowledge base under `docs/knowledge-base/` is maintained separately from generated API documentation under `docs/api/`.

- Read it for parser flow, model ownership, public exports, compatibility boundaries, and delivery behavior.
- Verify implementation details against source, tests, package metadata, and configuration.
- Ask before adding articles beyond the maintained index and architecture overview.
- Keep public repository content limited to publicly verifiable facts and links.

## Repository Layout

| Path                   | Purpose                                                |
| ---------------------- | ------------------------------------------------------ |
| `src/index.ts`         | Public source exports                                  |
| `src/parser.ts`        | Grammar registration, line parsing, and model assembly |
| `src/lines/`           | Typed SDP line models                                  |
| `src/model/`           | Session, media, codec, ICE, and block models           |
| `src/munge.ts`         | Helpers for changing parsed SDP models                 |
| `src/**/*.spec.ts`     | Co-located Jest unit tests                             |
| `src/sdp-corpus/`      | SDP fixtures used for parsing and round-trip tests     |
| `rollup.config.js`     | ESM, CommonJS, and declaration builds                  |
| `.github/workflows/`   | Pull-request checks and main-branch publishing         |
| `docs/knowledge-base/` | Maintained architecture guidance                       |
| `docs/api/`            | Generated TypeDoc output                               |

## Setup

Use the Node version selected by `.nvmrc` and the Yarn version pinned by `package.json`.

```bash
nvm use
yarn install --frozen-lockfile
yarn prepare
```

Do not use npm for dependency installation. `package.json` sets `engines.npm` to `please-use-yarn`.

## Development Commands

Run commands from the repository root.

| Command                   | Purpose                                                                             |
| ------------------------- | ----------------------------------------------------------------------------------- |
| `yarn build`              | Clean generated output and build ESM, CommonJS, and declaration artifacts           |
| `yarn watch`              | Run the Rollup build in watch mode                                                  |
| `yarn transpile:validate` | Type-check with TypeScript without emitting files                                   |
| `yarn test:unit`          | Run Jest unit tests                                                                 |
| `yarn test:coverage`      | Run Jest with coverage                                                              |
| `yarn test:lint`          | Run ESLint on TypeScript source                                                     |
| `yarn test:prettier`      | Check source and maintained Markdown formatting                                     |
| `yarn test:spelling`      | Spellcheck maintained source and documentation                                      |
| `yarn docs`               | Replace generated TypeDoc output under `docs/api/` while preserving maintained docs |
| `yarn fix`                | Apply configured Prettier and ESLint fixes                                          |

`yarn test` runs the build and every `test:*` script. Run `yarn transpile:validate` separately because the aggregate script does not include it.

## Coding Conventions

### TypeScript

- TypeScript strict mode, `noImplicitAny`, `strictNullChecks`, and `noImplicitReturns` are enabled.
- The compiler targets ES2015 and emits ESNext modules for Rollup.
- Keep parser functions deterministic and return `undefined` when a line parser does not match.
- Preserve unsupported SDP lines through the fallback and `otherLines` paths unless a compatibility change is intentional.
- Avoid `any` unless an existing boundary requires it and the reason is documented.

### Formatting, comments, and JSDoc

- Prettier uses a 100-character print width, single quotes, two-space indentation, and ES5 trailing commas.
- ESLint uses Airbnb, TypeScript, Jest, JSDoc, and Prettier rules.
- JSDoc is required for functions, classes, and methods unless a narrow existing suppression applies.
- Comments explain intent, protocol constraints, or counterintuitive behavior. Do not narrate obvious code or change history.
- Keep public API descriptions concise and include required `@param` and `@returns` tags.

### SDP behavior

- Every `Line` subclass owns parsing from its line value and serialization to a complete SDP line.
- Parser registration order matters because parsers for one line type are attempted in insertion order.
- `parseToModel` starts a new media block at each `MediaLine` and supports audio, video, and application media types.
- Model `toLines()` ordering is part of serialization behavior. Review ordering changes as compatibility-sensitive.
- Codec lines must reference a payload type declared by the media line, except wildcard RTCP feedback.
- Munging helpers must update related structures consistently, such as secondary codec payload types.

## Public API and Compatibility

`src/index.ts` re-exports the parser, typed lines, models, munging helpers, regex helpers, and utilities. Changes to those exports, exported signatures, serialization output, accepted grammar, error behavior, or package entry points can affect consumers and semantic versioning.

The package publishes ESM, CommonJS, and bundled declaration entry points from `dist/`. It has no runtime `dependencies`; build and test packages are development-only.

Unknown input lines are preserved internally and serialized through `otherLines`, but `UnknownLine` is not exported by `src/lines/index.ts`. Treat that fallback and the lack of subpath exports as compatibility boundaries.

See [the architecture overview](docs/knowledge-base/architecture/ts-sdp-overview.md) for the parser pipeline, model graph, extension points, and key modules.

## Testing

- Jest runs through `ts-jest` in the jsdom environment configured by `jest.config.js`.
- Tests are co-located as `src/**/*.spec.ts`.
- Parser tests use `src/sdp-corpus/` fixtures to check browser-produced SDP, custom grammar parsers, media-level connection lines, wildcard feedback, and round-trip behavior.
- Line tests cover regex parsing and serialization for individual SDP forms.
- Model and munging tests cover codec associations, wildcard feedback, secondary codec removal, candidate filtering, and media-specific behavior.
- Add a regression test for every parser, line-ordering, model-routing, munging, or public behavior change.
- Run `yarn transpile:validate` for exported type or model changes in addition to Jest.

Path-scoped detail lives in [.github/instructions/testing.instructions.md](.github/instructions/testing.instructions.md).

## Code Review Priorities

1. Preserve parse-to-serialize round trips for supported and unsupported lines.
2. Preserve parser ordering and custom `Grammar` extension behavior.
3. Route session, media, ICE, codec, and fallback lines to the correct model.
4. Keep munging helpers synchronized with payload references, wildcard feedback, and media scope.
5. Treat exports, declarations, entry points, accepted SDP syntax, output ordering, and thrown errors as compatibility-sensitive.
6. Require focused unit coverage and corpus cases for protocol edge cases.

Path-scoped detail lives in [.github/instructions/code-review.instructions.md](.github/instructions/code-review.instructions.md).

## CI/CD

- Pull requests install with Yarn, then run `yarn test:lint` and `yarn test:coverage` in GitHub Actions.
- Prettier, spelling, TypeScript validation, docs generation, and the aggregate `yarn test` command are not current pull-request gates.
- Pushes to `main` install dependencies, run `yarn build`, and invoke semantic-release.
- semantic-release analyzes Conventional Commits, publishes the public npm package, updates the changelog and package metadata, and commits configured release assets.
- Do not run semantic-release or publish locally unless the user explicitly requests a coordinated release.

Path-scoped detail lives in [.github/instructions/ci-cd.instructions.md](.github/instructions/ci-cd.instructions.md).

## Pull Requests

- Follow [docs/contributing/GIT_CONVENTIONS.md](docs/contributing/GIT_CONVENTIONS.md) for branches and Conventional Commits.
- Use [.github/skills/pr-description/SKILL.md](.github/skills/pr-description/SKILL.md) to draft the existing pull-request template from the complete committed diff and observed test evidence.
- Call out grammar, serialization, model, munging, public API, declaration, package-format, or semantic-version impact when applicable.
- Preserve the template headings and leave Generative AI disclosure choices to the author.

## Security and Public Scope

- Do not add secrets, tokens, credentials, private keys, certificates, `.env` values, private URLs, or absolute local paths.
- Do not copy private issue, documentation, CI, or consumer information into this public repository.
- Treat SDP text as potentially sensitive because it can contain network addresses, ICE credentials, and fingerprints. Do not add real session captures, credentials, or identifying data to tests or logs.
- Keep dependency and workflow changes deterministic through `yarn.lock` and review package-source changes carefully.

## Maintaining This Guidance

Update this guidance when public exports, parser/model boundaries, scripts, Node or Yarn requirements, tests, build outputs, workflows, or release behavior change.

If guidance disagrees with current source or configuration, fix the guidance rather than preserving stale assumptions.
