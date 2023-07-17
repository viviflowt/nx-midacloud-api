import { Exclude, Expose, Transform, TransformOptions } from 'class-transformer'
import { isArray, map, trim } from 'lodash'
import f from 'lodash/fp'

export const ExcludeIf = (
  condition: ({
    value,
    obj,
    options,
  }: {
    value: any
    obj: any
    options: any
  }) => boolean,
  options?: TransformOptions,
): PropertyDecorator => {
  return Transform(({ value, obj, options }) => {
    if (!condition({ value, obj, options })) {
      return value
    }
  }, options)
}

export const ExcludeToClassOnly = (): PropertyDecorator => {
  return Exclude({ toClassOnly: true })
}

export const ExcludeToPlainOnly = (): PropertyDecorator => {
  return Exclude({ toPlainOnly: true })
}

export const ExposeFor = (
  context: string | string[],
  options?: Omit<TransformOptions, 'groups'>,
): PropertyDecorator => {
  const groups = f.pipe(f.flatten, f.uniq, f.sortBy(f.identity))([context])
  return Expose({ groups, ...options })
}

export const ToBoolean = (): PropertyDecorator => {
  return Transform(
    (parameters) => {
      switch (parameters.value) {
        case 'true': {
          return true
        }
        case 'false': {
          return false
        }
        default: {
          return parameters.value
        }
      }
    },
    { toClassOnly: true },
  )
}

export function ToInt(): PropertyDecorator {
  return Transform(
    (parameters) => {
      const value = parameters.value as string

      return Number.parseInt(value, 10)
    },
    { toClassOnly: true },
  )
}

export function ToLowerCase(): PropertyDecorator {
  return Transform(
    (parameters) => {
      const value = parameters.value

      if (!value) {
        return
      }

      if (!Array.isArray(value)) {
        return value.toLowerCase()
      }

      return value.map((v) => v.toLowerCase())
    },
    { toClassOnly: true },
  )
}

export function ToUpperCase(): PropertyDecorator {
  return Transform(
    (parameters) => {
      const value = parameters.value

      if (!value) {
        return
      }

      if (!isArray(value)) {
        return value.toUpperCase()
      }

      return value.map((v) => v.toUpperCase())
    },
    { toClassOnly: true },
  )
}

export function Trim(): PropertyDecorator {
  return Transform((parameters) => {
    const value = parameters.value as string[] | string

    if (isArray(value)) {
      return f.pipe(
        f.map(f.flow(f.trim, f.replace(/\s\s+/g, ' '))),
        f.uniq,
      )(value)
    }

    return f.pipe(f.trim, f.replace(/\s\s+/g, ' '))(value)
  })
}
