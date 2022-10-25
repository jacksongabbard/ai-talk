#!/bin/bash -eu

# Pull in the configuration constants
source ./scripts/config.sh


if ! docker -v > /dev/null; then
  echo "⚠️  The local development environment requires Docker. Please install that first."
  exit 1;
fi


./scripts/stop-dev-env.sh
echo ""

if docker container inspect \
  $DOCKER_POSTGRES_CONTAINER_NAME &> /dev/null; then
  echo "Killing Docker Postgres container"
  docker container rm $DOCKER_POSTGRES_CONTAINER_NAME 1> /dev/null
fi

if [ -d "./localhost" ]; then
  echo "Removing localhost SSL certificates"
  rm -rf ./localhost
fi

echo "💀 Everything is dead."
