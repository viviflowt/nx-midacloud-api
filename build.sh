#!/bin/bash

# docker network create --driver bridge midacloud 2>/dev/null

# docker system prune -f -a --volumes

# docker compose pull --ignore-pull-failures

npm run build:docker

# docker compose down --remove-orphans nginx-proxy
