#!/usr/bin/env bash
set -uo pipefail

cd "$(dirname "$0")/.."

failures=0
THEME_STYLESHEET="src/theme/theme.css"

fail() {
  echo "FAIL  $1"
  failures=$((failures + 1))
}

pass() {
  echo "ok    $1"
}

authorization_files=$(grep -rlE '\bAuthorization\b' src --include='*.ts' --include='*.tsx' | sort)
authorization_count=$(printf '%s' "$authorization_files" | grep -c . || true)
if [ "$authorization_count" = "1" ] && [ "$authorization_files" = "src/api/httpClient.ts" ]; then
  pass "Authorization named only in src/api/httpClient.ts"
else
  fail "Authorization must appear in src/api/httpClient.ts only, found: ${authorization_files:-none}"
fi

stylesheets=$(find src -name '*.css' | sort)
if [ "$stylesheets" = "$THEME_STYLESHEET" ]; then
  pass "exactly one stylesheet ($THEME_STYLESHEET)"
else
  fail "expected exactly $THEME_STYLESHEET, found: ${stylesheets:-none}"
fi

hex_hits=$(grep -rnE '#[0-9a-fA-F]{3,8}\b' src --include='*.ts' --include='*.tsx' --include='*.css' \
  | grep -v "^$THEME_STYLESHEET:" || true)
if [ -z "$hex_hits" ]; then
  pass "no hex colours outside $THEME_STYLESHEET"
else
  fail "hex colours outside $THEME_STYLESHEET:"
  echo "$hex_hits"
fi

arbitrary_hits=$(grep -rnE '(^|[^a-zA-Z0-9])-?[a-z][a-z0-9-]*-\[[^]]+\]' src --include='*.tsx' --include='*.ts' || true)
if [ -z "$arbitrary_hits" ]; then
  pass "no Tailwind arbitrary values"
else
  fail "Tailwind arbitrary values found:"
  echo "$arbitrary_hits"
fi

mockup_hits=$(grep -rn 'Text discussion web client' src next.config.ts package.json Dockerfile Dockerfile.dev || true)
if [ -z "$mockup_hits" ]; then
  pass "no reference to the design mockup folder"
else
  fail "reference to the design mockup folder:"
  echo "$mockup_hits"
fi

dangerous_hits=$(grep -rn 'dangerouslySetInnerHTML' src || true)
if [ -z "$dangerous_hits" ]; then
  pass "no dangerouslySetInnerHTML"
else
  fail "dangerouslySetInnerHTML found:"
  echo "$dangerous_hits"
fi

if [ "$failures" -gt 0 ]; then
  echo "audit-greps: $failures check(s) failed"
  exit 1
fi

echo "audit-greps: all checks passed"
