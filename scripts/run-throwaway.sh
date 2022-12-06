#/bin/bash -eu

tsc -p tsconfig.json

(cd build && node throwaway.js)
