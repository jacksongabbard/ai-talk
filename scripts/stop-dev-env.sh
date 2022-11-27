#!/bin/bash -eu

# Pull in the configuration constants
source ./.env

echo "🛑 Stopping local development environment"
echo ""

if ! docker -v &> /dev/null; then
  echo "⚠️  The local development environment requires Docker. Please install that first."
  exit 1;
fi

if docker container inspect \
  $DOCKER_POSTGRES_CONTAINER_NAME &> /dev/null; then
  if [ "$( docker container inspect -f '{{.State.Running}}' $DOCKER_POSTGRES_CONTAINER_NAME )" == "false" ]; then
    echo "Docker Postgres container not running. Skipping this step."
  else
    echo "Stopping Docker Postgres container"
    docker stop $DOCKER_POSTGRES_CONTAINER_NAME
  fi
fi

echo "Local development environment stopped."
