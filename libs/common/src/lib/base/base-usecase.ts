import { Injectable } from '@nestjs/common'
import { AbstractService } from './base-service'

@Injectable()
export abstract class AbstractUseCase extends AbstractService {
  constructor() {
    super()
  }

  public abstract execute<T extends Record<string, any>, R>(
    input: T,
  ): Promise<R>
}
