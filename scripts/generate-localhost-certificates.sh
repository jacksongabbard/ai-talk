#!/bin/bash

# https://github.com/FiloSottile/mkcert

brew install mkcert
brew install nss # this seems to be needed for Firefox
mkcert -install

if [ ! -d "./.localhost/" ]; then
  mkdir ./.localhost
fi

SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
mkcert \
  -cert-file $SCRIPTPATH/../.localhost/localhost.crt \
  -key-file $SCRIPTPATH/../.localhost/localhost.key \
  localhost 127.0.0.1 ::1 0.0.0.0
