#!/bin/bash -eu

# Pull in the configuration constants
source ./scripts/config.sh

echo "Setting up local development environment"

if ! docker -v > /dev/null; then
  echo "The local development environment requires Docker. Please install that first."
  exit 1;
fi

if ! docker container inspect \
  $DOCKER_POSTGRES_CONTAINER_NAME > /dev/null; then

  echo "Starting Docker postgres container..."
  docker run \
    --name $DOCKER_POSTGRES_CONTAINER_NAME \
    -p $DOCKER_POSTGRES_CONTAINER_PORT:$DOCKER_POSTGRES_CONTAINER_PORT \
    -e POSTGRES_PASSWORD=$DOCKER_POSTGRES_CONTAINER_PASSWORD \
    -d postgres


elif [ "$( docker container inspect -f '{{.State.Status}}' \
  $DOCKER_POSTGRES_CONTAINER_NAME )" == "exited" ]; then

  echo "Restarting Docker Postgres container"
  docker start $DOCKER_POSTGRES_CONTAINER_NAME

else
  echo "Docker Postgres container already running."
fi
