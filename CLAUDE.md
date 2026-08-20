# Hogwarts API — Claude Code Project Guide

> A magical REST API + documentation site for the Harry Potter, Hogwarts Legacy and
> Fantastic Beasts universes. Serves characters, movies, books, spells, potions,
> soundtracks and quotes as free test data for developers.

- **Live site:** https://hogwarts-api.com
- **Repo:** https://github.com/ivopauly/hogwarts-api
- **License:** MIT
- **Hosting:** Netlify (deploy status badge in `README.md`)

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Nuxt 4 (`^4.5.2`), Vue 3 (`^3.5.41`), vue-router `^4` |
| Server / API | Nitro (Nuxt's built-in server engine), h3 event handlers |
| Docs theme | `shadcn-docs-nuxt` (`^1.2.2`) — consumed via `extends` |
| Content | Nuxt Content (markdown/MDC), provided by the theme |
| Styling | Tailwind CSS **4** (legacy JS config bridged via `@config`; entry `assets/css/tailwind.css`) |
| Language | TypeScript, ESM (`"type": "module"`) |
| Package manager | npm (`package-lock.json` is committed; `.npmrc` sets `shamefully-hoist=true`) |
| Node | 20+ (Nuxt 4 requirement); 22 LTS recommended |

There is **no linter, formatter or test runner installed** in this project today.
`npm run lint` and `npm test` do **not** exist — see `.claude/rules/testing.md`.
Typechecking does exist (`vue-tsc`), with one caveat below.

### Typecheck caveat

`npm run typecheck` reports ~127 errors, and **all of them are inside
`node_modules/shadcn-docs-nuxt`** — the theme package's `app.config` types are narrower
than the components that read them. They are not ours and cannot be fixed from here.

Project code is currently type-clean. To check only our own files:

```bash
npm run typecheck 2>&1 | grep 'error TS' | grep -v '^node_modules/'
```

`.claude/hooks/pre-commit-validate.sh` applies exactly that filter, so it fails on a
type error you introduced and stays quiet about the vendored ones.

## Commands

```bash
npm install          # install deps (runs `nuxt prepare` via postinstall)
npm run dev          # dev server → http://localhost:3000
npm run build        # production build → .output/
npm run preview      # preview the production build locally
npm run generate     # static prerender (used for the docs site)
npm run typecheck    # vue-tsc --noEmit
npx nuxt prepare     # regenerate .nuxt/ types after config/dependency changes
```

Quick API smoke checks while `npm run dev` is running:

```bash
curl -s http://localhost:3000/api/movies | head -c 400
curl -s http://localhost:3000/api/books | head -c 400
curl -s http://localhost:3000/api/books/hp1
```

## Architecture

```
.
├── nuxt.config.ts          # extends ['shadcn-docs-nuxt'] — theme comes from the package
├── app.config.ts           # site name, header/footer/nav, theme colour, TOC, search
├── tailwind.config.ts      # Tailwind setup
├── content/                # Nuxt Content markdown — the public documentation site
│   ├── index.md            # landing page (hero component)
│   ├── 1.getting-started/  # numeric prefixes drive sidebar order; _dir.yml sets titles
│   └── 2.api/
├── server/
│   ├── api/                # Nitro file-based API routes
│   │   ├── movies.ts       # GET /api/movies
│   │   └── books/
│   │       ├── index.ts    # GET /api/books
│   │       └── [name].ts   # GET /api/books/:name
│   ├── middleware/
│   │   └── log.ts          # logs every incoming request URL
│   └── data/               # per-entity JSON (books/hp1..hp7, movies/hp1..hp8, fb1..fb3)
├── assets/css/tailwind.css
└── public/                 # logo.svg, logo-dark.svg, logo.png, favicon.ico
```

### How routing works

- **API:** Nitro auto-registers everything under `server/api/`. The file path *is* the
  URL. `server/api/books/[name].ts` → `/api/books/:name`, read with
  `getRouterParam(event, 'name')`. Every handler is
  `export default defineEventHandler(async (event) => { ... })` and returns a plain
  object/array — Nitro serialises it to JSON. Auto-imports mean `defineEventHandler`,
  `getRouterParam`, `getQuery`, `createError` etc. are **not** imported explicitly.
- **Docs:** Nuxt Content maps `content/**` to routes. The leading `1.` / `2.` number
  prefixes only control ordering and are stripped from the URL
  (`content/1.getting-started/2.installation.md` → `/getting-started/installation`).
  `_dir.yml` files set the sidebar title/icon for a folder.
- **Theme:** All layouts and components come from the `shadcn-docs-nuxt` package via
  `extends`. There is no local `app.vue`, `pages/` or `components/` directory. To
  override a theme component, create a matching file locally — Nuxt layer resolution
  gives the project directory precedence over the extended layer.

### ⚠️ Known state of the data layer (read this before touching the API)

`server/api/movies.ts` and `server/api/books/index.ts` currently return **hardcoded
inline arrays**, and they are *incomplete* — `movies.ts` returns 5 of the 11 films,
`books/index.ts` returns 2 of the 7 books. Meanwhile `server/data/books/*.json` and
`server/data/movies/*.json` hold the full per-entity datasets and are **not imported
by anything**. `server/api/books/[name].ts` is still a placeholder that returns the
string `"Your magic book name is ${name}!"` rather than looking up a book.

The intended direction is for handlers to read from `server/data/`. When you work in
this area, prefer wiring handlers to the JSON files over extending the inline arrays,
and confirm the approach with the maintainer before a large refactor.

Data quirks worth knowing:
- `server/data/**/*.json` files are keyed by id via **filename** (`hp1.json`), and the
  JSON body itself has no `id` field — the inline arrays do.
- In `server/api/books/index.ts`, `hp2`'s chapter objects are inconsistent: the first
  nine use `summary`, the rest use `order` (and one is a number, not a string). Any
  normalisation work should make chapter shape uniform.
- Several `summary` fields are empty strings.

### Deployment

Netlify builds from `main`. Nuxt's Netlify preset is auto-detected — no adapter config
in `nuxt.config.ts`. Nitro API routes deploy as Netlify functions.

## Dependency stack notes (upgraded 2026-08-20)

`npm audit` is down to **1 low** finding (an esbuild dev-server issue that only affects
Windows, reached through `fontless`). It was 59 findings / 8 critical before the theme
upgrade. **Do not run `npm audit fix`** — the remaining item has no non-breaking fix and
`audit fix` has historically pulled release-candidate `unenv` builds that break the
Nitro prerender step.

The upgrade moved `shadcn-docs-nuxt` 0.6.5 → 1.2.2, which required Nuxt 3 → 4 and
Tailwind 3 → 4. Four things had to change in *this* repo, and all four are easy to
regress, so they are documented here:

1. **`nuxt.config.ts` must declare i18n.** The theme now bundles `@nuxtjs/i18n` with the
   `prefix_except_default` strategy. Without `defaultLocale` + `locales`, the theme's
   navigation composable throws `Cannot read properties of undefined (reading
   'children')` and every docs page 500s. We declare a single `en` locale.
2. **`assets/css/tailwind.css` must `@source` the theme.** Tailwind 4 skips
   `node_modules` during automatic content detection, so the theme layer contributes no
   utilities and the whole site renders unstyled. The explicit
   `@source '../../node_modules/shadcn-docs-nuxt'` opts it back in. Upstream's own docs
   site never hits this because it consumes the theme by relative path.
3. **`content.highlight.langs` must include `mdc`.** The docs author MDC samples in
   fenced blocks; without the language registered they do not highlight.
4. **Tailwind 4 removed config-level `safelist`.** It is replaced by
   `@source inline('dark')` in the CSS. Leaving `safelist` in `tailwind.config.ts` is a
   typecheck error.

This project has no `app/` directory, so Nuxt 4 keeps the Nuxt 3 root layout
(`assets/`, `app.config.ts`, `server/`, `content/` all stay where they are).

### Known regression from the upgrade

`content/1.getting-started/3.writing/3.components.md` and `4.prose.md` use the
0.6.5-era authoring pattern:

```
::code-group
  ::div{label="Preview"}
  ...
  ::
  ```mdc [Code]
  ...
  ```
::
```

shadcn-docs-nuxt 1.x replaced this with `::stack` plus a plain fenced block. 38 blocks
across those two files still use the old form; they render as a single "Preview" panel
instead of Preview/Code tabs. The code sample is still on the page, so nothing is lost —
it just is not tabbed.

Both files are **template placeholder documentation describing shadcn-docs-nuxt
itself**, not Hogwarts API docs. Migrating them is worth doing alongside replacing that
placeholder content with real API documentation. Upstream's current authoring is at
`www/content/2.components/` in the ZTL-UwU/shadcn-docs-nuxt repo.

## This repository is PUBLIC

`hogwarts-api` is a public, MIT-licensed repo on GitHub. Everything committed is
world-readable, and stays in the git history even if deleted in a later commit.

- Never commit credentials, tokens, connection strings, absolute home paths or
  personal email addresses.
- `.env`, `CLAUDE.local.md` and `.claude/settings.local.json` are gitignored — keep
  machine-specific and sensitive detail in those.
- `.mcp.json` **is** committed, so it must only ever reference secrets by
  `${ENV_VAR}` expansion, never by value.
- `.claude/hooks/pre-commit-validate.sh` runs a secret scan and blocks the commit on
  a hit. Do not bypass it with `--no-verify` to "fix later".

## Working in this repo

- Data changes (adding a book, movie, spell) are the most common contribution — they
  are JSON edits, not code. Validate JSON before committing (the pre-commit hook does).
- Docs changes are markdown under `content/`. Use MDC syntax; the theme's component
  reference lives at `content/1.getting-started/3.writing/3.components.md`.
- Never hand-edit `.nuxt/` — it is generated and gitignored.
- Secrets go in `.env` (gitignored). Nothing in this project currently needs one.

## Additional context

- `.claude/rules/code-style.md` — formatting and TypeScript/Vue conventions
- `.claude/rules/testing.md` — testing conventions and how to verify changes today
- `.claude/rules/git-conventions.md` — commit and branch naming
- `.claude/skills/debugging/SKILL.md` — how to debug Nuxt/Nitro issues here
- `CLAUDE.local.md` — machine-specific notes (uncommitted)
