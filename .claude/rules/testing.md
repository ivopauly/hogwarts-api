# Testing — Hogwarts API

## Current reality

**There is no test framework installed and no `test` script in `package.json`.**
Do not claim tests pass, and do not run `npm test` — it will fail. The PR template's
"all tests pass" checkbox is currently aspirational.

**Typechecking does exist:** `npm run typecheck` (`vue-tsc --noEmit`). It reports ~102
errors that all live inside `node_modules/shadcn-docs-nuxt` and are not ours. Judge only
errors outside `node_modules/`:

```bash
npm run typecheck 2>&1 | grep 'error TS' | grep -v '^node_modules/'
```

Empty output means project code is clean. The pre-commit hook applies this filter for you.

Until a runner is added, "verified" means the checks below actually ran and you saw
the output.

## How to verify a change today

1. **Typecheck and build must succeed.**
   ```bash
   npm run typecheck   # ignore node_modules/ errors, see above
   npm run build
   ```
2. **Dev server + real requests.** Start `npm run dev`, then hit the affected routes:
   ```bash
   curl -s http://localhost:3000/api/movies | jq 'length'
   curl -s http://localhost:3000/api/books  | jq '.[].id'
   curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/api/books/hp1
   ```
   Check the status code, not just that JSON came back.
3. **JSON data validity.** Every file under `server/data/` must parse:
   ```bash
   .claude/hooks/pre-commit-validate.sh
   ```
4. **Docs changes** — load the affected page in the browser and confirm the sidebar
   entry, title and any MDC components render. Markdown that fails to parse degrades
   silently rather than erroring.

## When adding a test runner

Vitest is the right choice for this stack — `@nuxt/test-utils` wraps it and can boot a
real Nitro server for endpoint tests.

```bash
npm i -D vitest @nuxt/test-utils happy-dom
```

(`vue-tsc` and `typescript@^5` are already installed as devDependencies. Note
`typescript@7` is **incompatible** with `vue-tsc@2` — it removed the `./lib/tsc`
subpath export that vue-tsc requires. Stay on the 5.x line.)

Conventions to follow once it exists:

- **Location:** `test/` at the root, mirroring the source tree
  (`test/server/api/books.test.ts`).
- **Naming:** `*.test.ts`. Describe the *route*, not the file:
  `describe('GET /api/books')`.
- **Endpoint tests** use `@nuxt/test-utils/e2e`'s `setup()` + `$fetch`, asserting on
  status code and response shape — not on exact prose, which changes with data edits.
- **Data tests** are the highest-value tests in this repo: assert that every file in
  `server/data/books/` parses, has the required keys, and that no two entities share
  an id. These catch the mistakes contributors actually make.
- **Do not snapshot** whole API responses. The payloads are large and data edits are
  routine; snapshots would turn every content contribution into a snapshot update.
- Assert the public field names are `snake_case` — that shape is the API contract.

## Test-writing discipline

- One behaviour per test; the name should state the expectation.
- No network calls to external sites (wizardingworld.com, fandom.com) in tests — the
  URLs in the data are values, not things to fetch.
- A failing test gets fixed or deleted, never skipped silently.
