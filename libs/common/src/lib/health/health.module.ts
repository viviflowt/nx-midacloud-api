import { DynamicModule, Module } from '@nestjs/common'

import { HttpModule } from '@nestjs/axios'
import { HealthCheckService } from './health.service'
import {
  DEFAULT_HEALTH_CHECK_DOMAIN_OPTIONS,
  DEFAULT_HEALTH_CHECK_PATH,
  HealthModuleOptions,
} from './module-options'

@Module({})
export class HealthCheckModule {
  static forRoot(options?: Partial<HealthModuleOptions>): DynamicModule {
    return {
      module: HealthCheckModule,
      imports: [HttpModule],
      providers: [
        {
          provide: 'HEALTH_CHECK_MODULE_OPTIONS',
          useValue: {
            path: options?.path ?? DEFAULT_HEALTH_CHECK_PATH,
            domain: {
              ...DEFAULT_HEALTH_CHECK_DOMAIN_OPTIONS,
              ...options?.domain,
            },
          },
        },
        HealthCheckService,
      ],
    }
  }
}
