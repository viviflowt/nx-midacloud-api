import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export abstract class AbstractService {
  protected logger = new Logger(this.constructor.name, {
    timestamp: true,
  })
}
