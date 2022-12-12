#!/bin/bash -eu

nodemon -e ts,tsx,css \
  --watch src/ \
  --exec "rm -rf build && \
    tsc -p tsconfig.json && \
    ./scripts/build-hydrate-files.sh && \
    NODE_PATH=./build node ./build/src/server/index.js;"
