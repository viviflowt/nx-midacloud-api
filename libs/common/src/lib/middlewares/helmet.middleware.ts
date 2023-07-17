import type { NestMiddleware } from '@nestjs/common'
import { Injectable, Logger } from '@nestjs/common'
import type { NextFunction, Request, Response } from 'express'
import helmet from 'helmet'

@Injectable()
export class HelmetMiddleware implements NestMiddleware {
  protected readonly logger = new Logger(this.constructor.name, {
    timestamp: true,
  })

  use(request: Request, response: Response, next: NextFunction): void {
    helmet()(request, response, next)
  }

  onModuleInit() {
    this.logger.log('Dependencies initialized')
  }
}
