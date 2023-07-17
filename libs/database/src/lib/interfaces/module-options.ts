/* eslint-disable unicorn/prevent-abbreviations */
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import { Provider, Type, ModuleMetadata } from '@nestjs/common'
import {
  TypeOrmDataSourceFactory,
  TypeOrmModuleOptions,
  TypeOrmOptionsFactory,
} from '@nestjs/typeorm'
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type'
import { DataSource, DataSourceOptions } from 'typeorm'

export interface DatabaseModuleOptions
  extends Omit<
    PostgresConnectionOptions,
    | 'host'
    | 'port'
    | 'database'
    | 'username'
    | 'password'
    | 'name'
    | 'type'
    | 'uuidExtension'
    | 'installExtensions'
    | 'migrationsTableName'
    | 'migrationsTransactionMode'
    | 'metadataTableName'
    | 'namingStrategy'
  > {
  name?: string // default is 'default'
  global?: boolean
}

export interface DatabaseModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  global?: boolean
  name?: string
  useExisting?: Type<TypeOrmOptionsFactory>
  useClass?: Type<TypeOrmOptionsFactory>
  useFactory?: (
    ...args: any[]
  ) => Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions
  inject?: any[]
  extraProviders?: Provider[]
}

export interface DatabaseModuleForFeatureOptions {
  entities: EntityClassOrSchema[]
  dataSource?: DataSource | DataSourceOptions | string
}
