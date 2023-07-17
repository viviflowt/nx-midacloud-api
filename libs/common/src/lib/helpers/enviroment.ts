export const DEVELOPMENT = 'development'
export const PRODUCTION = 'production'
export const TEST = 'test'
export const STAGING = 'staging'

export const isDevelopment = (): boolean => {
  return !process.env['NODE_ENV'] || process.env['NODE_ENV'] === DEVELOPMENT
}

export const isProduction = (): boolean => {
  return process.env['NODE_ENV'] === PRODUCTION
}

export const isTest = (): boolean => {
  return process.env['NODE_ENV'] === TEST
}

export const isStaging = (): boolean => {
  return process.env['NODE_ENV'] === STAGING
}

export const isDevelopmentOrTest = (): boolean => {
  return isDevelopment() || isTest()
}
