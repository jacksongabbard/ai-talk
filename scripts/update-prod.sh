#!/bin/bash -eu

git pull --rebase # allow local changes to stick around
npm install
./node_modules/.bin/sequelize db:migrate
./scripts/build-dev.sh
