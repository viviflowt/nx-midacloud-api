import type { OnModuleInit } from '@nestjs/common'
import { DynamicModule, Logger, Module, Optional } from '@nestjs/common'

import debug from 'debug'

@Module({})
export abstract class BaseModule implements OnModuleInit {
  protected logger: Logger = new Logger(this.constructor.name, {
    timestamp: true,
  })

  // TODO: implementar classe de debug
  // #debug: debug.IDebugger = debug(this.constructor.name)

  constructor() {}

  onModuleInit(): Promise<void> | void {
    this.logger.log('Dependencies initialized')
  }
}
