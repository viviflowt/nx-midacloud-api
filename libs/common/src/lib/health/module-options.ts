export interface HealthCheckDomainOptions {
  url: string
  retryCount: number // default 3
  retryDelay: number // default 1000
  timeout: number // default 5000
}

export interface HealthModuleOptions {
  path: string
  domain: HealthCheckDomainOptions
}

export const DEFAULT_HEALTH_CHECK_PATH = '/health'
export const DEFAULT_HEALTH_CHECK_DOMAIN = 'https://docs.nestjs.com'

export const DEFAULT_HEALTH_CHECK_DOMAIN_OPTIONS: HealthCheckDomainOptions = {
  url: DEFAULT_HEALTH_CHECK_PATH,
  retryCount: 3,
  retryDelay: 1000,
  timeout: 5000,
}
