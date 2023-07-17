#!/bin/bash

set -e

docker compose down --remove-orphans

docker compose pull --ignore-pull-failures

docker compose up -d \
  postgres \
  redis \
  mongo \
  localstack \
  mailhog

# docker run \
#   --name dnsmasq \
#   -d \
#   -p 53:53/udp \
#   -p 5380:8080 \
#   -v /opt/dnsmasq.conf:/etc/dnsmasq.conf \
#   --log-opt "max-size=100m" \
#   -e "HTTP_USER=admin" \
#   -e "HTTP_PASS=admin" \
#   --restart always \
#   jpillora/dnsmasq
