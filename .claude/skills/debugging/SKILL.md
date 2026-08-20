---
name: debugging
description: Use when debugging Nuxt 3 / Nitro issues in the Hogwarts API — API routes returning 404 or wrong data, auto-import errors, theme/layer problems, content pages not appearing, or Netlify build failures that don't reproduce locally.
---

# Debugging Hogwarts API (Nuxt 3 + Nitro)

Find the cause before changing anything. In a Nuxt layer-based project, the same
symptom has very different causes depending on which layer produced it, and guessing
usually means editing a file that was never involved.

## First: which layer is this?

| Symptom | Layer | Where to look |
|---|---|---|
| `/api/*` wrong status or wrong JSON | Nitro server | `server/api/**` |
| Page 404s, sidebar entry missing | Nuxt Content | `content/**`, `_dir.yml` |
| Wrong colours, header, footer, nav | Theme config | `app.config.ts` |
| Component renders wrong / missing | `shadcn-docs-nuxt` layer | `node_modules/shadcn-docs-nuxt` |
| `Cannot find name 'defineEventHandler'` | Generated types | `.nuxt/` — run `npx nuxt prepare` |
| Works locally, breaks on deploy | Nitro preset / build | `npm run build` then `npm run preview` |

This project has **no local `app.vue`, `pages/` or `components/`**. If a UI bug isn't
explained by `app.config.ts` or `content/`, it lives in the theme package — read the
package source before assuming the bug is yours.

## Logs to check, in order

1. **The dev server terminal.** `server/middleware/log.ts` logs `New request: <url>`
   for *every* request. If your request never appears there, it never reached Nitro —
   the problem is the URL, the method, or the client, not the handler.
2. **`console.log` inside the handler.** Server-side logs go to the terminal, never to
   the browser console. Log the parsed params first:
   ```ts
   console.log("[books/:name]", getRouterParam(event, "name"), getQuery(event));
   ```
3. **Browser DevTools Network tab** for the actual status code and response body.
   A Nitro `createError` renders as a JSON error object with a real status; a thrown
   raw `Error` becomes an opaque 500.
4. **Browser console** for hydration mismatches and client-side theme errors.
5. **Nuxt DevTools** (Shift+Alt+D in the dev server) — the *Server Routes* tab lists
   every route Nitro actually registered and lets you invoke them. This is the fastest
   way to confirm a route exists.
6. **Netlify deploy log** for build-only failures.

## Playbooks

### API route returns 404

1. Does it appear in DevTools → Server Routes? If not, Nitro never registered it.
2. Check the file path — routing is file-based and literal.
   `server/api/books/[name].ts` → `/api/books/:name`. A typo in the folder name is a
   silent 404, not an error.
3. Confirm the file has `export default defineEventHandler(...)`. A named export or a
   plain function export registers nothing.
4. Restart the dev server. New files under `server/` are usually picked up, but a new
   *directory* sometimes needs a restart.

### API returns the wrong or incomplete data

Read `AGENTS.md` → "Known state of the data layer" first. `server/api/movies.ts` and
`server/api/books/index.ts` return hardcoded, **deliberately incomplete** inline arrays
(5 of 11 movies, 2 of 7 books), and `server/api/books/[name].ts` is a placeholder that
returns a greeting string. Missing entries are usually this known gap, not a new bug.
`server/data/**/*.json` holds the full dataset and is currently imported by nothing.

### `defineEventHandler is not defined` / missing types

Auto-imports come from generated `.nuxt/` types.
```bash
npx nuxt prepare
```
If that doesn't fix it, delete `.nuxt` and re-run. Never add a manual import as the
fix — it hides a broken generated-types state.

### Content page doesn't show up

1. Filename needs a numeric prefix to be ordered: `2.installation.md`. The prefix is
   stripped from the URL.
2. Front-matter must have a `title` and must be valid YAML — a bad delimiter makes the
   page silently disappear rather than error.
3. `_dir.yml` controls the folder's sidebar title/icon.
4. Restart the dev server after adding a new content directory.

### Works locally, fails on Netlify

1. Reproduce with a real production build — `npm run dev` is a different code path:
   ```bash
   npm run build && npm run preview
   ```
2. Check for anything relying on dev-only behaviour: absolute filesystem paths,
   `process.cwd()`, or reading files at runtime (Nitro bundles server assets; use
   `import` or `useStorage('assets:server')` rather than `fs`).
3. Compare Node versions — Netlify's default may differ from yours.

### Data change didn't take effect

Confirm the file you edited is actually read. `server/data/**` is currently unused;
editing it changes nothing at runtime until a handler imports it.

## Rules

- Reproduce with `curl` before opening files — the exact status code narrows it fast.
- Change one thing at a time and re-run the same `curl`.
- Never "fix" a symptom by widening a try/catch or returning a fallback object; that
  turns a 500 into a wrong 200.
- Remove debug `console.log` before committing (`server/middleware/log.ts` is the one
  intentional logger — leave it).
- If you can't reproduce it, say so rather than shipping a speculative fix.
