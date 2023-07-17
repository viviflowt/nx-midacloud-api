import { BaseModule } from '@mida/common'
import { isListening } from '@mida/core'
import { DynamicModule, Logger, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { EntityClassOrSchema } from '@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type'
import { merge } from 'lodash/fp'
import ms from 'ms'
import 'reflect-metadata'
import { DataSource, DataSourceOptions } from 'typeorm'
import { DatabaseModuleAsyncOptions, DatabaseModuleOptions } from './interfaces'
import {
  DEFAULT_METADATA_TABLENAME,
  DEFAULT_MIGRATIONS_TABLE_NAME,
  SnakeNamingStrategy,
} from './utils'

@Module({})
export class DatabaseModule extends BaseModule {
  constructor() {
    super()
  }

  protected static async configureCache(config: ConfigService) {
    const [, host, port = 6379] =
      config.get<string>('REDIS_URL', { infer: true })?.split(':') ?? []

    if (!host || !port) {
      Logger.warn(`Cache is not available at ${host}:${port}`)
      return {}
    }

    return isListening(host, Number(port)).then((isListening) => {
      if (!isListening) {
        Logger.warn(`Cache is not available`, 'DatabaseModule')
      }

      return isListening
        ? {
            cache: {
              type: 'ioredis',
              options: {
                url: config.get<string>('REDIS_URL', { infer: true }),
                db: +config.get<number>('REDIS_DB', 0, { infer: true }),
              },
              ignoreErrors: true,
              duration: ms('30s'),
              alwaysEnabled: false,
            },
          }
        : {}
    })
  }

  static forRoot(options?: DatabaseModuleOptions): DynamicModule {
    return {
      module: DatabaseModule,
      global: options?.global,
      imports: [
        ConfigModule,
        TypeOrmModule.forRootAsync({
          name: options?.name ?? 'default',
          imports: [ConfigModule],
          useFactory: async (
            config: ConfigService,
          ): Promise<TypeOrmModuleOptions> => {
            return merge({
              type: 'postgres',
              url: config.get<string>('DATABASE_URL', {
                infer: true,
              }),
              synchronize: config.get<boolean>('DB_SYNCHRONIZE', false, {
                infer: true,
              }),
              dropSchema: config.get<boolean>('DB_DROP_SCHEMA', false, {
                infer: true,
              }),
              migrationsRun: config.get<boolean>('DB_MIGRATIONS_RUN', false, {
                infer: true,
              }),
              migrationsTransactionMode: 'all',
              migrationsTableName: DEFAULT_MIGRATIONS_TABLE_NAME,
              namingStrategy: new SnakeNamingStrategy(),
              uuidExtension: 'uuid-ossp',
              installExtensions: true,
              metadataTableName: DEFAULT_METADATA_TABLENAME,
              logging: ['error', 'warn', 'migration'],
              logger: 'advanced-console',
              autoLoadEntities: true,
              ...(await this.configureCache(config)),
            })(options) as TypeOrmModuleOptions
          },
          inject: [ConfigService],
        }),
      ],
      exports: [TypeOrmModule],
    }
  }

  static forRootAsync(options: DatabaseModuleAsyncOptions): DynamicModule {
    return {
      module: DatabaseModule,
      global: options?.global,
      imports: [
        ConfigModule,
        TypeOrmModule.forRootAsync({
          name: options?.name ?? 'default',
          imports: [ConfigModule, ...(options?.imports ?? [])],
          useExisting: options?.useExisting,
          useClass: options?.useClass,
          useFactory: async (
            config: ConfigService,
            ...args: any[]
          ): Promise<TypeOrmModuleOptions> => {
            return merge({
              type: 'postgres',
              url: config.get<string>('DATABASE_URL', {
                infer: true,
              }),
              synchronize: config.get<boolean>('DB_SYNCHRONIZE', false, {
                infer: true,
              }),
              dropSchema: config.get<boolean>('DB_DROP_SCHEMA', false, {
                infer: true,
              }),
              migrationsRun: config.get<boolean>('DB_MIGRATIONS_RUN', false, {
                infer: true,
              }),
              migrationsTransactionMode: 'all',
              migrationsTableName: DEFAULT_MIGRATIONS_TABLE_NAME,
              namingStrategy: new SnakeNamingStrategy(),
              uuidExtension: 'uuid-ossp',
              installExtensions: true,
              metadataTableName: DEFAULT_METADATA_TABLENAME,
              logging: ['error', 'warn', 'migration'],
              logger: 'advanced-console',
              autoLoadEntities: true,
              ...(await this.configureCache(config)),
            })(
              await (options?.useFactory?.call
                ? options.useFactory.call(undefined, config, ...args)
                : options?.useFactory?.(...args)),
            ) as TypeOrmModuleOptions
          },
          inject: [ConfigService, ...(options?.inject ?? [])],
        }),
      ],
      exports: [TypeOrmModule],
    }
  }

  static forFeature(options: {
    entities: EntityClassOrSchema[]
    dataSource?: DataSource | DataSourceOptions | string
  }): DynamicModule {
    return {
      module: DatabaseModule,

      imports: [
        TypeOrmModule.forFeature(
          options.entities,
          options?.dataSource ?? 'default',
        ),
      ],
      exports: [TypeOrmModule],
    }
  }
}
