import { AbstractService, AbstractUseCase } from '@mida/common'
import { Injectable } from '@nestjs/common'
import { InjectEntityManager } from '@nestjs/typeorm'
import { EntityManager } from 'typeorm'

export interface CreateAccountInput {
  email: string
  password: string
}

@Injectable()
export class CreateAccountService extends AbstractUseCase {
  constructor(
    @InjectEntityManager()
    private readonly manager: EntityManager,
  ) {
    super()
  }

  public async execute<CreateAccountInput, R>(
    input: CreateAccountInput,
  ): Promise<R> {
    console.log('input', input)

    return {
      ...input,
    } as any
  }
}
