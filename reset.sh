#!/bin/bash

NPM_CLEAN() {
  rm -rf dist 2>/dev/null
  rm -rf build 2>/dev/null
  rm -rf .cache 2>/dev/null
  rm -rf tmp 2>/dev/null
  rm -rf yarn.lock 2>/dev/null
  rm -rf node_modules 2>/dev/null
  rm -rf package-lock.json 2>/dev/null
  rm -rf pnpm-lock.yaml 2>/dev/null
}

# npm i -D -s @types/node @types/jest @types/multer @types/express 2>/dev/null

NPM_CLEAN

# pnpm install
# pnpm update

# NPM_CLEAN

# npm install
# npm audit fix

# https://github.com/typestack/class-transformer
# https://github.com/typestack/class-validator
# https://blog.devgenius.io/virtual-column-and-computer-column-solutions-for-typeorm-in-nestjs-7a4d44b34923

# https://github.com/jmcdo29/testing-nestjs
# https://github.com/BrunnerLivio/nestjs-integration-test-db-example

# https://github.com/marcoesposito/nestjs-typeorm-multi-tenant
# https://github.com/thomasvds/nestjs-multitenants
# https://github.com/dmitriy-nz/nestjs-form-data
# https://github.com/pvarentsov/nestjs-pg-notify
# https://github.com/nestjs-steroids/async-context
# https://github.com/rubenjgarcia/nestjs-abac-app
# https://github.com/Pop-Code/nestjs-acl

# https://github.com/tkosminov/nestjs-example
# https://github.com/Jon-Peppinck/messenger-api
# https://github.com/s1seven/nestjs-tools
# https://github.com/FurlanLuka/microservice-stack/blob/main/libs/nest-typeorm-migrations/src/lib/migration-generator.service.ts

# midacloud.ddns.net

# Portainer
# https://localhost:9443

# RabbitMQ
# http://localhost:15672

# Mailhog
# http://localhost:8025

# sudo lsof -i -P -n | grep LISTEN
