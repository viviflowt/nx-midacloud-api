import { Controller, Get, Post } from '@nestjs/common'

@Controller()
export class HelloController {
  @Get('hello')
  getHello() {
    return 'Hello World!'
  }

  @Post('hello')
  helloPost() {
    return 'Hello World!'
  }
}
