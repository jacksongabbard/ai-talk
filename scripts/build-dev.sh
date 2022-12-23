#!/bin/bash -eu

nodemon -e ts,tsx,css \
  --watch src/ \
  --exec "./node_modules/.bin/esbuild src/server/index.ts \
      --bundle \
      --platform=node \
      --target=es2019 \
      --minify=false \
      --outfile=build/server-build.js \
    && \
      ./scripts/build-hydrate-files.sh && \
      NODE_PATH=./build node ./build/server.js;"
