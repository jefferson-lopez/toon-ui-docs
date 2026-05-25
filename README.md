# toon-ui-docs

Standalone Next.js + Fumadocs site for ToonUI documentation.

## Why this repo exists

This site was extracted from the monorepo to reduce local development overhead.
The goal is to keep docs and marketing work isolated from workspace-level filesystem watching.

## Current package targets

- `@toon-ui/core`: `^2.1.7`
- `@toon-ui/react`: `^2.1.6`

## Local development

```bash
pnpm install
pnpm dev
```

## Typecheck

```bash
pnpm typecheck
```

## Build

```bash
pnpm build
```

## Notes

- The app now consumes published package versions such as `@toon-ui/core` and `@toon-ui/react`.
- If you need to preview unreleased package changes, publish a prerelease version or use a temporary local link deliberately.
- Generated Fumadocs artifacts live under `.source/` and should not be committed unless you explicitly want generated files in git.
