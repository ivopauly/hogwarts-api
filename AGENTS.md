# Hogwarts API — Agent Guide

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
| Node | **24** — pinned via `.nvmrc` and `engines.node: ">=24"` in `package.json` |

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

**Keep TypeScript on the 5.x line.** TypeScript 7 removed the `typescript/lib/tsc`
subpath export, and `vue-tsc` still resolves it, so `npm run typecheck` dies with
`ERR_PACKAGE_PATH_NOT_EXPORTED` before checking anything. This was re-verified against
`vue-tsc@3.3.10`, whose peer range advertises `typescript: ">=5.0.0"` — the declaration
is simply ahead of the implementation. `.github/dependabot.yml` ignores major bumps of
`typescript` for this reason; drop that ignore once vue-tsc stops looking for lib/tsc.

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
└── public/                 # brand assets, all generated from one source PNG by
                            #   scripts/branding/generate-logo-assets.mjs
                            #   logo.png / logo-dark.png       full lockup
                            #   logo-mark.png / -dark.png      shield only (header)
                            #   favicon.ico                    multi-size, mark only
                            #   apple-touch-icon.png           180x180, opaque
                            #   og-image.png                   1200x630 social card
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

### The data layer

`server/data/` holds one flat JSON file per collection, each an array of records:

| File | Records | Source |
|---|---|---|
| `books.json` | 7 | Potter DB + chapter lists preserved from this repo |
| `movies.json` | 11 | Potter DB (one release date repaired from Fandom) |
| `characters.json` | 5,410 | Potter DB |
| `spells.json` | 345 | Potter DB |
| `potions.json` | 168 | Potter DB |
| `creatures.json` | 143 | Fandom wiki — Potter DB has no creatures endpoint |

Handlers read these through `server/utils/collections.ts`, which is auto-imported by
Nitro. Errors go through `server/utils/magicError.ts`, which puts a themed line in
`statusMessage` and keeps the real explanation in `data.reason` — when adding a route,
throw via `magicError()` rather than `createError()` so the two stay consistent, and
always pass the literal reason so the API stays debuggable.

`server/middleware/magic-headers.ts` stamps `X-Sorting-Hat`, `X-Wizard-Status` and
`X-Deployment-Location` onto `/api` responses only; HTML pages and Nuxt's internal
`/api/_*` endpoints are deliberately skipped. The datasets are **statically imported** so Nitro bundles them; do not switch to
reading them with `fs` at runtime — that works in dev and breaks in the deployed
Netlify function.

`characters.json` is 4.4 MB and is imported as a **JS module**, so Rollup parses it
into an AST and holds it in memory for the whole bundle. That has two consequences:

1. **Build memory.** Netlify's builder caps Node's old-space at ~2 GB and the build
   exceeds it, dying with `FATAL ERROR: Ineffective mark-compacts near heap limit`
   (exit 134). `netlify.toml` raises the limit to 4096 MB. This never reproduces
   locally — a dev machine's default heap is much higher (4288 MB on macOS/arm64) —
   so a green local build says nothing about CI here. To reproduce a CI failure:
   `NODE_OPTIONS=--max-old-space-size=2048 npm run build`.
2. **Cold-start size.** It is the main contributor to the deployed function's size.

Adding another collection of that scale will push past 4096 too. The structural fix is
Nitro `serverAssets` — ship the JSON as a file beside the function rather than compiled
into it, so Rollup never parses it. That makes reads async and needs a memoised loader.

Regenerate any dataset with the scripts in `scripts/seed/` — see its README. They are
one-off tools and are not imported by the app.

### API shape

Every response is wrapped in `data`. List endpoints add `meta`.

- `GET /api` — directory of collections
- `GET /api/{collection}` — paginated list; `?search=`, `?page=`, `?page_size=` (max 100)
- `GET /api/{collection}/{name}` — one record by slug, exact name, or a name that
  slugifies to a known slug

Collections: `books`, `characters`, `creatures`, `movies`, `potions`, `spells`.

Missing values are `null` rather than omitted, so every record in a collection has the
same keys. Character data is sparse — `name` is 100% filled, `patronus` is 4%.

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

### Writing docs in `content/`

`content/` holds the real Hogwarts API documentation (it used to be the theme's
placeholder demo docs). Structure:

- `content/index.md` — landing hero
- `content/1.getting-started/` — introduction, quick start, pagination, errors
- `content/2.endpoints/` — one reference page per collection

**MDC syntax matters and changed in shadcn-docs-nuxt 1.x.** Multi-language examples use
`::code-group` containing fenced blocks whose label is in square brackets:

````
::code-group
```bash [curl]
curl https://hogwarts-api.com/api/books
```

```js [JavaScript]
await fetch('https://hogwarts-api.com/api/books');
```
::
````

The pre-1.x form — `::code-group` wrapping a `::div{label="Preview"}` — renders as a
single untabbed panel and must not be reintroduced. For a rendered-component preview
next to its source, 1.x uses `::stack`.

Numeric filename prefixes drive sidebar order and are stripped from the URL, so
renumbering a file changes a published URL.

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

These are written for Claude Code but are plain markdown — read them regardless of
which agent or editor you are:

- `.claude/rules/code-style.md` — formatting and TypeScript/Vue conventions
- `.claude/rules/testing.md` — testing conventions and how to verify changes today
- `.claude/rules/git-conventions.md` — commit and branch naming
- `.claude/skills/debugging/SKILL.md` — how to debug Nuxt/Nitro issues here
- `.claude/hooks/pre-commit-validate.sh` — run this before committing; it validates
  JSON, checks every API route exports a handler, typechecks project code and scans
  for secrets
- `CLAUDE.local.md` — machine-specific notes (uncommitted)

---

*This file is the single source of truth for agent context in this repo. `CLAUDE.md`
imports it, so edit **this** file — not `CLAUDE.md`.*
