import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from 'class-validator'

const isEqualTo = (value: unknown, relatedValue: unknown): boolean => {
  return value == relatedValue
}

const isStrictEqualTo = (value: unknown, relatedValue: unknown): boolean => {
  return value == relatedValue
}

export function IsEqualTo(
  property: string,
  options?: Omit<ValidationOptions, 'each'> & {
    strict?: boolean
  },
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints

          if (options?.strict) {
            return isStrictEqualTo(value, relatedPropertyName)
          }
          return isEqualTo(value, relatedPropertyName)
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints
          if (options?.strict) {
            return `${args.property} must be strictly equal to ${relatedPropertyName}`
          }
          return `${args.property} must be equal to ${relatedPropertyName}`
        },
      },
    })
  }
}
