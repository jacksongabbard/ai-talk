#!/bin/bash -eu

# Pull in the configuration constants
source ./.env

echo "Setting up local development environment"

if ! docker -v > /dev/null; then
  echo "The local development environment requires Docker. Please install that first."
  exit 1;
fi

if ! docker container inspect \
  $DOCKER_POSTGRES_CONTAINER_NAME &> /dev/null; then

  echo "Starting Docker postgres container..."
  docker run \
    --name $DOCKER_POSTGRES_CONTAINER_NAME \
    -p "$DOCKER_POSTGRES_CONTAINER_PORT:5432" \
    -e "POSTGRES_PASSWORD=$DOCKER_POSTGRES_CONTAINER_PASSWORD" \
    -e "POSTGRES_USER=$DOCKER_POSTGRES_CONTAINER_USER" \
    -e "POSTGRES_DB=$DOCKER_POSTGRES_CONTAINER_DB" \
    -d "ankane/pgvector"


elif [ "$( docker container inspect -f '{{.State.Status}}' \
  $DOCKER_POSTGRES_CONTAINER_NAME )" == "exited" ]; then

  echo "Restarting Docker Postgres container"
  docker start $DOCKER_POSTGRES_CONTAINER_NAME

else
  echo "Docker Postgres container already running."
fi

if [ ! -d "./.localhost" ]; then
  echo "No localhost development SSL certificates detected. Generating them."
  ./scripts/generate-localhost-certificates.sh
fi
