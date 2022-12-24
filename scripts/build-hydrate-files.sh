#!/bin/bash -eu

PATHS=`find . -name "hydrate.tsx" | tr "\n" " "`

echo "$PATHS"

./node_modules/.bin/esbuild $PATHS \
  --bundle \
  --minify \
  --sourcemap=linked \
  --outdir=build/src/server/routes \
  --platform="browser" \
  --allow-overwrite
