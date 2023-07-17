#!/bin/bash

set -e

echo -e "Starting bootstrap...\n"

install_registry() {
  LOCAL_REGISTRY=localhost:5000

  docker volume rm registry_data 2>/dev/null
  docker volume create registry_data 2>/dev/null

  docker run -d \
    -p 5000:5000 \
    --name registry \
    --restart=always \
    -v registry_data:/var/lib/registry \
    registry:2

  # wait for registry to start and running
  while ! docker ps | grep -q registry; do
    sleep 1
  done

  while ! curl -s localhost:5000/v2/_catalog | grep -q repositories; do
    sleep 1
  done

  echo -e "Registry is ready!\n"
  sleep 5
}

install_portainer() {
  PORTAINER_USERNAME=admin
  PORTAINER_PASSWORD=admin

  htpasswd -nb -B $PORTAINER_USERNAME $PORTAINER_PASSWORD | cut -d ":" -f 2 >./portainer_password

  docker volume create portainer_data 2>/dev/null

  PORTAINER_HASHED_PASSWORD=$(cat portainer_password)

  rm ./portainer_password

  docker run -d \
    -p 8000:8000 \
    -p 9443:9443 \
    --name portainer \
    --restart=always \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v portainer_data:/data portainer/portainer-ce:latest \
    --http-enabled \
    --admin-password=$PORTAINER_HASHED_PASSWORD

  while ! docker ps | grep -q portainer; do
    sleep 1
  done

  echo -e "Portainer is ready!\n"
  sleep 5
}

# check if portainer is running
if ! docker ps | grep -q portainer; then
  echo -e "Portainer is not running, installing...\n"
  sleep 1
  install_portainer
fi

# check if registry is running
if ! docker ps | grep -q registry; then
  echo -e "Registry is not running, installing...\n"
  sleep 1
  install_registry
fi

# check if dependencies are installed and install them
if [ ! -d node_modules ]; then
  npm install --verbose
fi

# remove unused docker images
docker image prune -a -f --volumes 2>/dev/null

# check if docker compose is running and stop it
if [ docker compose ps | grep -q Up ]; then
  docker compose down --remove-orphans
fi

# pull docker images
docker compose pull --ignore-pull-failures --parallel
