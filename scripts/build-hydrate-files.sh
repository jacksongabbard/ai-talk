#!/bin/bash -eu

find . -name '*hydrate.js' \
  -exec \
    ./node_modules/.bin/esbuild "{}" \
    --bundle \
    --minify \
    --outfile="{}" \
    --allow-overwrite \;