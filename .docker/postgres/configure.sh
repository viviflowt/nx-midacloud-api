#!/bin/bash

set -e

while ! pg_isready -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER"; do
  echo "waiting for postgres to be ready..."
  sleep 0.1
done

echo -e "***** proceeding with postgres setup *****"

psql -v ON_ERROR_STOP=1 \
  --echo-queries \
  --username "$POSTGRES_USER" <<-EOSQL

    SET client_min_messages TO WARNING;
    SET timezone TO 'America/Sao_Paulo';

    -- create extensions
    CREATE EXTENSION IF NOT EXISTS "adminpack";
    CREATE EXTENSION IF NOT EXISTS "autoinc";
    CREATE EXTENSION IF NOT EXISTS "btree_gin";
    CREATE EXTENSION IF NOT EXISTS "btree_gist";
    CREATE EXTENSION IF NOT EXISTS "citext";
    CREATE EXTENSION IF NOT EXISTS "fuzzystrmatch";
    CREATE EXTENSION IF NOT EXISTS "hstore";
    CREATE EXTENSION IF NOT EXISTS "ltree";
    CREATE EXTENSION IF NOT EXISTS "pg_trgm";
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    CREATE EXTENSION IF NOT EXISTS "tablefunc";
    CREATE EXTENSION IF NOT EXISTS "unaccent";
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- create database
    CREATE DATABASE identity;
    GRANT ALL PRIVILEGES ON DATABASE identity TO $POSTGRES_USER;
    ALTER DATABASE identity SET timezone TO 'America/Sao_Paulo';
    ALTER DATABASE identity SET datestyle TO 'ISO, DMY';
    ALTER DATABASE identity SET intervalstyle TO 'iso_8601';
    ALTER DATABASE identity SET default_text_search_config TO 'pg_catalog.portuguese';

    -- create database
    CREATE DATABASE gateway;
    GRANT ALL PRIVILEGES ON DATABASE gateway TO $POSTGRES_USER;
    ALTER DATABASE gateway SET timezone TO 'America/Sao_Paulo';
    ALTER DATABASE gateway SET datestyle TO 'ISO, DMY';
    ALTER DATABASE gateway SET intervalstyle TO 'iso_8601';
    ALTER DATABASE gateway SET default_text_search_config TO 'pg_catalog.portuguese';

    -- create database
    CREATE DATABASE notification;
    GRANT ALL PRIVILEGES ON DATABASE notification TO $POSTGRES_USER;
    ALTER DATABASE notification SET timezone TO 'America/Sao_Paulo';
    ALTER DATABASE notification SET datestyle TO 'ISO, DMY';
    ALTER DATABASE notification SET intervalstyle TO 'iso_8601';
    ALTER DATABASE notification SET default_text_search_config TO 'pg_catalog.portuguese';

    -- create database
    CREATE DATABASE tenant;
    GRANT ALL PRIVILEGES ON DATABASE tenant TO $POSTGRES_USER;
    ALTER DATABASE tenant SET timezone TO 'America/Sao_Paulo';
    ALTER DATABASE tenant SET datestyle TO 'ISO, DMY';
    ALTER DATABASE tenant SET intervalstyle TO 'iso_8601';
    ALTER DATABASE tenant SET default_text_search_config TO 'pg_catalog.portuguese';
EOSQL

echo -e "***** postgres setup complete *****"
