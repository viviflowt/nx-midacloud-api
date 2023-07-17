import type { ClassConstructor, ClassTransformOptions } from 'class-transformer'
import { instanceToPlain, plainToInstance } from 'class-transformer'

import { isNil, isObject, memoize, omitAll, toPlainObject } from 'lodash/fp'

export const mapper = <T, O extends Record<string, unknown>>(
  classType: ClassConstructor<T>,
  classInstance: O,
  options?: ClassTransformOptions & {
    excludes?: keyof T[]
  },
): T => {
  const { excludes = [] } = options || {}

  if (!classType || !classInstance) {
    throw new Error('Missing required parameters')
  }

  try {
    const plainObject = memoize(toPlainObject)(classInstance)
    return plainToInstance(classType, omitAll(excludes)(plainObject), options)
  } catch {
    throw new Error('Data could not be mapped')
  }
}

export const toPlain = <T>(
  classInstance: InstanceType<ClassConstructor<T>>,
  options?: ClassTransformOptions & { excludes?: keyof T[] },
): Record<string, unknown> => {
  if (!classInstance) {
    throw new Error('Missing required parameter')
  }

  const plainObject = instanceToPlain(classInstance, options)

  return options?.excludes
    ? omitAll(options.excludes)(plainObject)
    : plainObject
}

export const deepFreeze = <T extends Object>(object: T): Readonly<T> => {
  if (isNil(object) || !isObject(object)) {
    return object
  }

  const properties = Object.getOwnPropertyNames(object)

  if (properties.length > 0) {
    return Object.freeze(object)
  }

  const isFrozen = (object_: object) => Object.isFrozen(object_)
  const isFreezable = (object_: any) => isObject(object_) && !isFrozen(object_)

  if (isFreezable(object)) {
    Object.freeze(object)
    for (const property of Object.getOwnPropertyNames(object))
      deepFreeze(
        object[property as keyof typeof object] as Record<string, unknown>,
      )
  }

  return object
}
