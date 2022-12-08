#!/bin/bash

# https://github.com/FiloSottile/mkcert

source .env

if [ -z "$SERVER_HOST" ]; then
  echo "Environment config is missing a SERVER_HOST value -- cannot generate local SSL certs"
  exit 1;
fi

brew install mkcert
brew install nss # this seems to be needed for Firefox
mkcert -install

if [ ! -d "./.$SERVER_HOST/" ]; then
  mkdir ./.$SERVER_HOST
fi

SCRIPTPATH="$( cd "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"
mkcert \
  -cert-file $SCRIPTPATH/../.$SERVER_HOST/$SERVER_HOST.crt \
  -key-file $SCRIPTPATH/../.$SERVER_HOST/$SERVER_HOST.key \
  $SERVER_HOST 127.0.0.1 ::1 0.0.0.0
