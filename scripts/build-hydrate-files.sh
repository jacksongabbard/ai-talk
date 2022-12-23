#!/bin/bash -eu

find . -name '*.hydrate.ts' \
  -exec \
    ./node_modules/.bin/esbuild "{}" \
    --bundle \
    --minify \
    --sourcemap=linked \
    --outfile="{}" \
    --outdir="build" \
    --platform="browser" \
    --allow-overwrite \;
