import type { Request } from 'express'
import { isString } from 'lodash/fp'

export const extractTokenFromHeader = (
  request: Request,
): string | undefined => {
  const header = request.headers?.authorization
  if (!header) return undefined

  const [type, token] = header.split(' ')
  if (type !== 'Bearer') return undefined

  return token
}

export const getUrl = (request: Request): string => {
  return request.originalUrl ?? request.url
}

export const getHeaders = (request: Request): Map<string, string> => {
  const headers = new Map<string, string>()

  for (const [key, value] of Object.entries(request.headers)) {
    if (isString(value)) {
      headers.set(key, value)
    }
  }

  return headers
}

export const getHeader = (name: string) => {
  return (request: Request): string | undefined => {
    return getHeaders(request).get(name)
  }
}
