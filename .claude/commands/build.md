---
description: Production build with the project's pre-flight checks
allowed-tools: Bash(npm run build:*), Bash(npm run preview:*), Bash(npx nuxt prepare:*), Bash(.claude/hooks/pre-commit-validate.sh)
---

Run a full production build of the Hogwarts API.

1. Validate the data and types first: `.claude/hooks/pre-commit-validate.sh`.
   If it fails, fix the reported problems before building.
2. If `nuxt.config.ts`, `app.config.ts` or dependencies changed since the last build,
   run `npx nuxt prepare` to regenerate `.nuxt/` types.
3. Build: `npm run build`.
4. Report the outcome honestly:
   - success or failure, with the actual error if it failed
   - the `.output/` size summary Nuxt prints
   - any warnings — especially unresolved imports or missing Nitro routes
5. If I ask to check the result, run `npm run preview` and hit
   `http://localhost:3000/api/books` to confirm the built server responds.

Do not report success unless the build command exited 0.

$ARGUMENTS
