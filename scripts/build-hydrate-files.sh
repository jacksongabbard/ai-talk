#!/bin/bash -eu

PATHS=`find . -name "hydrate*.tsx" | tr "\n" " "`

echo "$PATHS"

./node_modules/.bin/esbuild $PATHS \
  --bundle \
  --minify=false \
  --sourcemap=linked \
  --outdir=build/src/static \
  --platform="browser" \
  --allow-overwrite
