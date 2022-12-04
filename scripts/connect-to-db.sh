#!/bin/bash -eu

source .env

PGPASSWORD=$POSTGRES_PASSWORD psql \
  --host $POSTGRES_HOST \
  --port $POSTGRES_PORT \
  --user $POSTGRES_USER \
  $POSTGRES_DB;

