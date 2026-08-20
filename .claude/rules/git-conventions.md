# Git Conventions — Hogwarts API

## Commit messages

This repo uses **Conventional Commits** (visible throughout `git log`):

```
<type>(<optional scope>): <short imperative summary>
```

- Lowercase type, no period at the end, imperative mood ("add", not "added"/"adds").
- Keep the subject ≤ 72 characters.
- Body (optional, after a blank line) explains *why*, not *what* — the diff shows what.
- Reference issues in the body or footer: `Fixes #12`, `Refs #9`.

### Types used here

| Type | Use for |
|---|---|
| `feat` | new endpoint, new data entity, new site capability |
| `fix` | broken route, bad JSON, wrong data |
| `docs` | anything under `content/`, `README.md`, `CONTRIBUTING.md` |
| `chore` | dependency bumps, config, tooling, version bumps |
| `refactor` | restructuring with no behaviour change |
| `style` | formatting only |
| `test` | tests (once a runner exists) |
| `ci` | `.github/` workflows and templates |

### Scopes

Optional, but useful ones for this project: `api`, `books`, `movies`, `data`,
`content`, `theme`, `deps`.

```
feat(api): serve books from server/data instead of inline array
fix(data): correct chapter shape for hp2
docs(content): document the /api/movies response fields
chore(deps): bump nuxt from 3.13.2 to 3.15.2
```

Dependabot writes `chore(deps): Bump x from a to b` — leave those subjects alone.

## Branches

`main` is the default and protected-by-convention branch; Netlify deploys from it.
`dev` exists as an integration branch. Never commit directly to `main` — open a PR.

```
<type>/<short-kebab-description>
```

- `feat/spells-endpoint`
- `fix/books-name-route`
- `docs/api-reference`
- `chore/upgrade-nuxt`
- `data/add-hogwarts-legacy-characters`

Include the issue number when there is one: `fix/12-books-404`.
Dependabot's `dependabot/npm_and_yarn/*` branches are machine-generated — ignore this
scheme for those.

## Pull requests

- Fill in `.github/PULL_REQUEST_TEMPLATE.md` — summary, linked issue, checklist.
- Link the issue with a closing keyword (`Fixes #<n>`) so it auto-closes.
- Keep PRs single-purpose. A data addition and an API refactor are two PRs.
- Screenshots for anything that changes the rendered site.
- Squash-merge; the squash subject should itself be a valid conventional commit.

## Rules for Claude

- **Never commit or push without being asked.** Both are `ask` in `.claude/settings.json`.
- If work starts on `main`, create a branch before the first commit.
- Never `git push --force` or `git reset --hard` on a shared branch (both are denied).
- Do not amend or rewrite commits that already exist on `origin`.
- Do not add `.env`, `.nuxt/`, `.output/`, `node_modules/`, `.DS_Store` or
  `CLAUDE.local.md` to a commit.
