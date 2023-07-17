import { Body, Controller, Inject, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CreateAccountDto } from '../dto/create-account.dto'
import { CreateAccountService } from '../services/create-account.service'

@Controller({ path: 'accounts', version: '1' })
@ApiTags('accounts')
export class AccountsController {
  constructor(
    @Inject(CreateAccountService)
    private readonly createAccountService: CreateAccountService,
  ) {}

  @Post()
  async createAccount(@Body() data: CreateAccountDto) {
    const { email, password } = data

    const result = await this.createAccountService.execute({
      email,
      password,
    })

    return result
  }
}
