import { HttpService } from '@nestjs/axios'
import {
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { lastValueFrom } from 'rxjs'
import { getUptime } from '../helpers'
import { retry } from '../helpers/promise'
import { HealthModuleOptions } from './module-options'

@Injectable()
export class HealthCheckService implements OnModuleInit {
  private readonly logger = new Logger(HealthCheckService.name, {
    timestamp: true,
  })

  constructor(
    @Inject('HEALTH_CHECK_MODULE_OPTIONS')
    private readonly options: HealthModuleOptions,

    @Inject(HttpService)
    private readonly httpService: HttpService,
    @Inject(HttpAdapterHost)
    private readonly adapterHost: HttpAdapterHost,
  ) {}

  protected get httpAdapter() {
    return this.adapterHost.httpAdapter
  }

  protected async ping(): Promise<boolean> {
    return retry(
      () => lastValueFrom(this.httpService.get('https://docs.nestjs.com')),
      this.options.domain.retryCount,
      this.options.domain.retryDelay,
    )
      .then((response) => response?.status === HttpStatus.OK)
      .catch(() => false)
  }

  protected async handleHealthCheck(
    _: Request,
    response: Response,
  ): Promise<void> {
    const isHealthy: boolean = await this.ping()

    if (!isHealthy) {
      return this.httpAdapter.reply(
        response,
        { status: 'error', message: 'Service unavailable' },
        HttpStatus.SERVICE_UNAVAILABLE,
      )
    }

    const healthCheckResponse = {
      status: 'ok',
      uptime: getUptime(),
      environment: process.env['NODE_ENV'],
    }

    return this.httpAdapter.reply(response, healthCheckResponse, HttpStatus.OK)
  }

  async initialize(): Promise<void> {
    if (!this.httpAdapter) {
      throw new Error('No http adapter found')
    }

    this.httpAdapter.get(this.options.path, this.handleHealthCheck.bind(this))
  }

  async onModuleInit(): Promise<void> {
    await this.initialize()
    this.logger.log(`Health check initialized at ${this.options.path}`)
  }
}
