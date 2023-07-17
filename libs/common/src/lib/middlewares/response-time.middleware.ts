import { Injectable, NestMiddleware, Logger } from '@nestjs/common'
import type { NextFunction, Request, Response } from 'express'
import responseTime from 'response-time'

@Injectable()
export class ResponseTimeMiddleware implements NestMiddleware {
  protected readonly logger = new Logger(this.constructor.name, {
    timestamp: true,
  })

  use(request: Request, response: Response, next: NextFunction) {
    responseTime({
      digits: 2,
      header: 'X-Response-Time',
    })(request, response, next)
  }

  onModuleInit() {
    this.logger.log('Dependencies initialized')
  }
}
