#!/bin/bash -eu

find . -name '*hydrate.js' \
  -exec \
    ./node_modules/.bin/esbuild "{}" \
    --bundle \
    --minify \
    --sourcemap=linked \
    --outfile="{}" \
    --allow-overwrite \;
