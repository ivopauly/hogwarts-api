---
description: Validate JSON data, types and API route wiring without a full build
allowed-tools: Bash(.claude/hooks/pre-commit-validate.sh), Bash(npm run typecheck:*), Bash(node -e:*), Bash(jq:*), Bash(find:*), Bash(grep:*)
---

Run the fast correctness checks for this repo — no build, no dev server.

1. `.claude/hooks/pre-commit-validate.sh` — JSON parse + typecheck.
2. Cross-check data consistency and report anything off:
   - every file in `server/data/books/` and `server/data/movies/` parses
   - files of the same entity type share the same top-level key set
   - no duplicate ids across `server/api/*.ts` inline arrays
   - no empty-string `summary` fields introduced by this change
3. Confirm every file under `server/api/` still default-exports a
   `defineEventHandler` — a route that doesn't is a silent 404 in production.
4. Summarise as a short pass/fail list. Say plainly which checks you actually ran.

$ARGUMENTS
