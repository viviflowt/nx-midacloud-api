import { ClassSerializerInterceptor, Module } from '@nestjs/common'
import './polyfills'

import { CustomValidationPipe, HealthCheckModule } from '@mida/common'
import { DatabaseModule } from '@mida/database'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'

import { AccountsController } from './controllers/accounts.controller'
import { HelloController } from './controllers/hello.controller'
import { Account } from './entities'
import { CreateAccountService } from './services/create-account.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
    }),
    HealthCheckModule.forRoot({
      path: '/health',
    }),
    DatabaseModule.forRootAsync({
      useFactory: async (config: ConfigService) => ({
        name: 'default',
        url: config.get<string>('DATABASE_URL', { infer: true }),
        synchronize: true,
        dropSchema: false,
        entities: [Account],
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [HelloController, AccountsController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_PIPE,
      useClass: CustomValidationPipe,
    },
    CreateAccountService,
  ],
})
export class AppModule {}
