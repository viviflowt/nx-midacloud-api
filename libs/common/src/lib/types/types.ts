export type Falsey = false | '' | null | undefined
export type Truthy<T> = T extends Falsey ? never : T

export type Or<T, U> = T | U
export type And<T, U> = T & U

export type Optional<T> = T | undefined
export type Nullable<T> = T | null
export type Maybe<T> = Optional<Nullable<T>>

export type List<T> = readonly T[]
export type Dictionary<T> = Record<string, T>
export type Collection<T> = List<T> | Dictionary<T>

export type One<T> = T | readonly [T]
export type Many<T> = T | readonly T[]
export type OneOrMany<T> = One<T> | Many<T>

export type KeysOf<T> = keyof T
export type ValueOf<T> = T[keyof T]

export type ObjectLiteral = Dictionary<any>
export type PlainObject = Record<string, any>

export type Constructor<T, Arguments extends unknown[] = undefined[]> = new (
  ...arguments_: Arguments
) => T

export type InstanceOf<T> = T extends Constructor<infer U> ? U : never

export type Class<T> = Constructor<T> | Function

export type ClassOf<T> = T extends Class<infer U> ? U : never

export type ClassInstance<T> = T extends Class<infer U> ? U : never

export type AbstractClass<T> = Function & { prototype: T }
