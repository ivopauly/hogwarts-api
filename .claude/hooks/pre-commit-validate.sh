#!/usr/bin/env bash
#
# pre-commit-validate.sh — fast correctness checks for the Hogwarts API.
#
# Checks, in order:
#   1. Every server/data/**/*.json parses as valid JSON
#   2. Every JSON file staged for commit parses (catches package.json, .mcp.json, etc.)
#   3. Every server/api/** route default-exports a defineEventHandler
#   4. TypeScript typecheck, if the toolchain is available
#
# Usage:
#   .claude/hooks/pre-commit-validate.sh          # check the whole repo
#   .claude/hooks/pre-commit-validate.sh --staged # check only staged files
#
# Install as a real git pre-commit hook:
#   chmod +x .claude/hooks/pre-commit-validate.sh
#   ln -sf ../../.claude/hooks/pre-commit-validate.sh .git/hooks/pre-commit
#
# Exits non-zero on the first category of failure so a bad commit is blocked.

set -uo pipefail

# Make ourselves executable if a fresh clone dropped the bit.
[ -x "$0" ] || chmod +x "$0" 2>/dev/null || true

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_ROOT" || exit 1

STAGED_ONLY=0
[ "${1:-}" = "--staged" ] && STAGED_ONLY=1

RED=$'\033[0;31m'; GREEN=$'\033[0;32m'; YELLOW=$'\033[0;33m'; DIM=$'\033[2m'; RESET=$'\033[0m'
[ -t 1 ] || { RED=""; GREEN=""; YELLOW=""; DIM=""; RESET=""; }

FAILED=0
pass() { printf '%s✓%s %s\n' "$GREEN" "$RESET" "$1"; }
fail() { printf '%s✗%s %s\n' "$RED" "$RESET" "$1"; FAILED=1; }
warn() { printf '%s!%s %s\n' "$YELLOW" "$RESET" "$1"; }
info() { printf '%s  %s%s\n' "$DIM" "$1" "$RESET"; }

printf '\n%s— Hogwarts API pre-commit validation —%s\n\n' "$DIM" "$RESET"

# ---------------------------------------------------------------------------
# Collect the JSON files to check
# ---------------------------------------------------------------------------
json_files=()
if [ "$STAGED_ONLY" -eq 1 ]; then
  while IFS= read -r f; do
    [ -n "$f" ] && [ -f "$f" ] && json_files+=("$f")
  done < <(git diff --cached --name-only --diff-filter=ACMR -- '*.json' \
           | grep -vE '^(package-lock\.json|tsconfig.*\.json|jsconfig.*\.json)$' || true)
else
  while IFS= read -r f; do
    json_files+=("$f")
  done < <(find server content . -maxdepth 4 -name '*.json' \
             -not -path './node_modules/*' \
             -not -path './.nuxt/*' \
             -not -path './.output/*' \
             -not -name 'package-lock.json' \
             -not -name 'tsconfig*.json' \
             -not -name 'jsconfig*.json' 2>/dev/null | sort -u)
fi

# ---------------------------------------------------------------------------
# 1 + 2. JSON validity
# ---------------------------------------------------------------------------
if [ "${#json_files[@]}" -eq 0 ]; then
  info "no JSON files to check"
else
  bad_json=0
  for f in "${json_files[@]}"; do
    if ! node -e 'JSON.parse(require("fs").readFileSync(process.argv[1],"utf8"))' "$f" 2>/tmp/hw_json_err; then
      fail "invalid JSON: $f"
      sed 's/^/      /' /tmp/hw_json_err | head -3
      bad_json=1
    fi
  done
  rm -f /tmp/hw_json_err
  [ "$bad_json" -eq 0 ] && pass "JSON valid (${#json_files[@]} file(s))"
fi

# ---------------------------------------------------------------------------
# 3. Every API route default-exports a defineEventHandler
# ---------------------------------------------------------------------------
if [ -d server/api ]; then
  bad_routes=0
  while IFS= read -r route; do
    if ! grep -q 'export default defineEventHandler' "$route"; then
      fail "no \`export default defineEventHandler\` in $route (route will not register)"
      bad_routes=1
    fi
  done < <(find server/api -name '*.ts' -type f)
  [ "$bad_routes" -eq 0 ] && pass "API routes export defineEventHandler"
fi

# ---------------------------------------------------------------------------
# 4. TypeScript typecheck (best effort — vue-tsc is not a dependency of this project)
# ---------------------------------------------------------------------------
if [ ! -d .nuxt ]; then
  warn "typecheck skipped — .nuxt/ missing (run: npx nuxt prepare)"
elif [ -x node_modules/.bin/vue-tsc ]; then
  # vue-tsc typechecks the whole Nuxt layer graph, which pulls in shadcn-docs-nuxt.
  # That package ships ~100 pre-existing type errors of its own (its app.config types
  # are narrower than the components that read them). Those are not ours and we cannot
  # fix them from here, so gate only on errors in OUR files.
  npx --no-install vue-tsc --noEmit >/tmp/hw_tsc_out 2>&1
  grep 'error TS' /tmp/hw_tsc_out 2>/dev/null | grep -v '^npm warn' > /tmp/hw_tsc_err || true
  own_errors="$(grep -v '^node_modules/' /tmp/hw_tsc_err || true)"
  vendor_count="$(grep -c '^node_modules/' /tmp/hw_tsc_err 2>/dev/null || echo 0)"

  if [ -n "$own_errors" ]; then
    fail "typecheck failed ($(printf '%s\n' "$own_errors" | wc -l | tr -d ' ') error(s) in project code)"
    printf '%s\n' "$own_errors" | head -20 | sed 's/^/      /'
  else
    pass "typecheck clean (vue-tsc — project code)"
  fi
  if [ "$vendor_count" -gt 0 ]; then
    info "ignored $vendor_count pre-existing type error(s) inside node_modules/ (theme package)"
  fi
  rm -f /tmp/hw_tsc_out /tmp/hw_tsc_err
else
  # Plain `tsc` is not a substitute here: without vue-tsc it cannot resolve the .vue
  # SFCs re-exported by shadcn-docs-nuxt, so it emits hundreds of false TS2307 errors.
  warn "typecheck skipped — vue-tsc not installed (npm i -D vue-tsc)"
fi

# ---------------------------------------------------------------------------
# 5. Files that should never be committed
#    hogwarts-api is a PUBLIC repository. Anything committed here is world-readable
#    and stays in the git history even after a later deletion.
# ---------------------------------------------------------------------------
if [ "$STAGED_ONLY" -eq 1 ]; then
  offenders="$(git diff --cached --name-only --diff-filter=ACMR \
               | grep -E '(^|/)(\.env($|\.)|\.DS_Store$|CLAUDE\.local\.md$)|^\.nuxt/|^\.output/|^node_modules/|(^|/)settings\.local\.json$' || true)"
  if [ -n "$offenders" ]; then
    fail "these must not be committed to a public repo:"
    printf '%s\n' "$offenders" | sed 's/^/      /'
  else
    pass "no ignored/secret files staged"
  fi
fi

# ---------------------------------------------------------------------------
# 6. Secret scan
# ---------------------------------------------------------------------------
SECRET_RE='ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|gho_[A-Za-z0-9]{20,}|nfp_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9]{20,}|xox[baprs]-[A-Za-z0-9-]{10,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|(api[_-]?key|apikey|secret|passwd|password|auth[_-]?token|access[_-]?token)["'"'"']?[[:space:]]*[:=][[:space:]]*["'"'"'][A-Za-z0-9_\-]{16,}["'"'"']'

if [ "$STAGED_ONLY" -eq 1 ]; then
  # Scan added lines only — "+" prefixed, excluding the +++ file header.
  # BSD grep treats \+ in a BRE as an invalid repetition operator, so select added
  # lines with awk rather than a backslash-escaped grep pattern.
  hits="$(git diff --cached -U0 --diff-filter=ACMR \
          | awk '/^\+\+\+/ { next } /^\+/ { print substr($0, 2) }' \
          | grep -EI "$SECRET_RE" || true)"
else
  files_to_scan="$(git status --porcelain -uall | awk '{print $2}')"
  hits=""
  for f in $files_to_scan; do
    [ -f "$f" ] || continue
    found="$(grep -HnEI "$SECRET_RE" "$f" || true)"
    [ -n "$found" ] && hits="${hits}${found}"$'\n'
  done
fi

if [ -n "${hits// /}" ]; then
  fail "possible secret detected — this repo is PUBLIC, do not commit this:"
  printf '%s\n' "$hits" | head -10 | cut -c1-160 | sed 's/^/      /'
  info "if it is a false positive, rephrase the line or use an \${ENV_VAR} placeholder"
else
  pass "no secrets detected"
fi

# Local paths / personal email leaking into a public repo
leaks="$(git status --porcelain -uall | awk '{print $2}' \
         | while read -r f; do [ -f "$f" ] && grep -HnEI '/Users/[a-zA-Z0-9._-]+/|/home/[a-zA-Z0-9._-]+/' "$f"; done || true)"
if [ -n "$leaks" ]; then
  warn "absolute home paths found (fine in gitignored files, not in committed ones):"
  printf '%s\n' "$leaks" | head -5 | cut -c1-160 | sed 's/^/      /'
fi

printf '\n'
if [ "$FAILED" -ne 0 ]; then
  printf '%sValidation failed — commit blocked.%s\n\n' "$RED" "$RESET"
  exit 1
fi
printf '%sAll checks passed.%s\n\n' "$GREEN" "$RESET"
exit 0
