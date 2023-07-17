import { Body, Controller, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { CreateUserDto } from '../dto/create-user.dto'

@Controller({ path: 'users', version: '1' })
@ApiTags('users')
export class UsersController {
  // constructor() {}

  @Post()
  async createAccount(@Body() data: CreateUserDto) {
    const { email, password } = data

    return {
      email,
      password,
    }
  }
}
