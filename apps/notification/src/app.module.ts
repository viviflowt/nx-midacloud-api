import { Module } from '@nestjs/common'
import './polyfills'

import { HealthCheckModule } from '@mida/common'
import { DatabaseModule } from '@mida/database'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { HelloController } from './controllers/hello.controller'
import { Contact } from './entities/contact.entity'

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
        entities: [Contact],
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [HelloController],
  providers: [],
})
export class AppModule {}
