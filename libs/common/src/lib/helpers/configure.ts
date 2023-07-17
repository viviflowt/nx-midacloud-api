import { registerAs, ConfigFactory } from '@nestjs/config'

import { isObject } from 'lodash/fp'

export const configure = <T extends Record<string, unknown>>(
  config: T,
  namespace?: string,
): ConfigFactory => {
  if (!config || !isObject(config)) {
    throw new Error('config must be an object')
  }

  return namespace
    ? registerAs(namespace, () => ({
        ...config,
      }))
    : () => ({
        ...config,
      })
}
