#!/bin/bash -eu

git pull
npm install
./node_modules/.bin/sequelize db:migrate
./scripts/build-dev.sh
