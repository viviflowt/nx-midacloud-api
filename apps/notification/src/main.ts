import { NestFactory } from '@nestjs/core'

import { getPort, setupApplication } from '@mida/core'
import { VersioningType } from '@nestjs/common'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import responseTime from 'response-time'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  })

  await setupApplication(app)

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
    prefix: 'v',
  })

  app.enableCors({ origin: '*' })

  app.use(compression())
  app.use(helmet())
  app.use(responseTime())
  app.use(cookieParser())

  const port = await getPort(Number(process.env['PORT']) ?? 3000)

  await app.listen(port)
}

bootstrap()
