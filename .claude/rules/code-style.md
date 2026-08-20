# Code Style — Hogwarts API

No linter or formatter is installed. These conventions are derived from the existing
source, so **match the surrounding file** rather than importing habits from elsewhere.

## Baseline (matches current source)

- **TypeScript + ESM.** `"type": "module"`; use `import`/`export`, never `require`.
- **2-space indent**, semicolons **required**, **double quotes** in `server/**/*.ts`.
  (`nuxt.config.ts` and `app.config.ts` mix in single quotes — leave those as they are.)
- **Trailing commas** in multi-line arrays/objects.
- **80–100 column** soft wrap; long string literals (summaries, URLs) are allowed to run
  over rather than being broken up.
- No default export other than the handler/config object a Nuxt file is expected to
  export.

## Nitro / server routes

- Every route is `export default defineEventHandler(async (event) => { ... })`.
  Keep `async` even when the body is synchronous — it matches the existing handlers and
  keeps the signature stable when data loading is added.
- **Do not import Nuxt/Nitro helpers.** `defineEventHandler`, `getRouterParam`,
  `getQuery`, `readBody`, `createError`, `setResponseStatus`, `getRequestURL` are
  auto-imported. Adding an explicit import is a code smell here.
- Return plain objects/arrays. Nitro serialises them; do not hand-roll
  `JSON.stringify` or set `content-type` manually.
- Signal errors with `createError({ statusCode: 404, statusMessage: "Book not found" })`,
  never by returning an ad-hoc `{ error: ... }` object with a 200 status.
- File-based routing is the API contract: `server/api/books/[name].ts` → `/api/books/:name`.
  Renaming a file changes a public URL — treat it as a breaking change.
- Leave a one-line comment above the handler body saying which endpoint it serves, as
  the existing routes do.

## Naming

- **API response fields:** `snake_case` (`release_date`, `box_office`, `music_composers`).
  This is the established public shape — do not "fix" it to camelCase.
- **TypeScript identifiers:** `camelCase` for variables/functions, `PascalCase` for
  types and interfaces.
- **Entity ids:** lowercase series prefix + number — `hp1`…`hp7` (books),
  `hp1`…`hp8` and `fb1`…`fb3` (movies). New series get a new short prefix.
- **Files:** kebab-case for new `.ts` files; dynamic segments in square brackets.

## JSON data files (`server/data/**`)

- 2-space indent, one key per line, UTF-8, **no trailing comma** (JSON, not JSONC).
- Key order should mirror the existing files: `title`, `summary`, then metadata, then
  nested collections (`chapters`) last.
- Filename is the entity id (`hp1.json`); the body carries no `id` field.
- Keep field sets consistent across every file of the same entity type. If you add a
  field to one book, add it (even as `""` or `[]`) to all seven.
- Use straight quotes in prose where possible; existing files contain curly
  apostrophes (`’`) — do not mass-rewrite them, but prefer `'` in new text.

## Vue / markdown content

- There are no local `.vue` components — all UI comes from the `shadcn-docs-nuxt`
  layer. If a component override is genuinely needed, use `<script setup lang="ts">`
  and Composition API, and say why in the PR.
- `content/**/*.md` uses MDC. Front-matter needs `title`; `description` and `icon`
  are conventional. Numeric filename prefixes (`2.installation.md`) drive sidebar
  order and are stripped from the URL — renumbering changes published URLs.

## If you want tooling

Adding ESLint (`@nuxt/eslint`) and Prettier would be a welcome contribution, but it is
a project-wide decision: the reformat touches every file and buries real diffs. Propose
it in an issue before doing it as part of an unrelated change.
