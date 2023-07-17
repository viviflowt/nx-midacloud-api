import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  OnModuleInit,
} from '@nestjs/common'
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  Optional,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import type { Observable } from 'rxjs'
import { TimeoutError } from 'rxjs'
import { catchError, timeout } from 'rxjs/operators'

export interface TimeoutInterceptorOptions {
  seconds?: number
}

const DEFAULT_TIMEOUT = 60
const DEFAULT_TIMEOUT_ERROR = 'Request Timeout'
const DEFAULT_TIMEOUT_MESSAGE = 'Request Timeout'
const DEFAULT_TIMEOUT_STATUS = HttpStatus.REQUEST_TIMEOUT

const SECOND = 1000

@Injectable()
export class TimeoutInterceptor implements NestInterceptor, OnModuleInit {
  protected logger = new Logger(this.constructor.name, {
    timestamp: true,
  })

  constructor(
    @Inject(ConfigService)
    @Optional()
    private readonly configService: ConfigService,
  ) {
    if (this.configService) {
      this.timeout = this.configService.get<number>(
        'TIMEOUT_SECONDS',
        DEFAULT_TIMEOUT,
        { infer: true },
      )
    }
  }

  public setLogger(logger?: Logger) {
    if (logger) {
      this.logger = logger
    }
  }

  protected options: TimeoutInterceptorOptions = {
    seconds: 60,
  }

  set timeout(seconds: number) {
    this.options.seconds = Math.round(seconds)
  }

  get timeout(): number {
    return this.options?.seconds ?? DEFAULT_TIMEOUT
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { seconds = DEFAULT_TIMEOUT } = this.options
    return next
      .handle()
      .pipe(timeout(seconds * SECOND))
      .pipe(
        catchError((error) => {
          if (error instanceof TimeoutError) {
            const error =
              context.getType() === 'http'
                ? new HttpException(
                    {
                      statusCode: DEFAULT_TIMEOUT_STATUS,
                      error: DEFAULT_TIMEOUT_ERROR,
                      message: DEFAULT_TIMEOUT_MESSAGE,
                    },
                    DEFAULT_TIMEOUT_STATUS,
                  )
                : new Error('The request has timeout')
            throw error
          }
          throw error
        }),
      )
  }

  onModuleInit() {
    this.logger.log(`Dependency initialized`)
  }
}
