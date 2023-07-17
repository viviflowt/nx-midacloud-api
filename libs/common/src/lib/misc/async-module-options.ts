import type { ModuleMetadata, Provider, Type } from '@nestjs/common'
import _ from 'lodash'

export interface OptionsFactory<T> {
  createOptions(): Promise<T> | T
}

export interface AsyncOptionsFactoryProvider<T>
  extends Pick<ModuleMetadata, 'imports' | 'exports'> {
  isGlobal?: boolean
  useExisting?: {
    value: OptionsFactory<T>
    provide?: string | symbol | Type<any>
  }
  useClass?: Type<OptionsFactory<T>>
  useFactory?: (...arguments_: any[]) => Promise<T> | T
  inject?: any[]
}

export function createAsyncOptionsProvider<T>(
  provide: string | symbol | Type<any>,
  options: AsyncOptionsFactoryProvider<T>,
): Provider {
  if (options.useFactory) {
    return {
      provide,
      useFactory: options.useFactory,
      inject: options.inject || [],
    }
  }

  return {
    provide,
    useFactory: async (optionsFactory: OptionsFactory<T>) => {
      return optionsFactory.createOptions()
    },
    inject: [
      options.useClass ||
        _.get(
          options,
          'useExisting.provide',
          (options.useExisting as any).value.constructor.name,
        ),
    ],
  }
}
