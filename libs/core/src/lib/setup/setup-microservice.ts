import { INestApplication } from '@nestjs/common'
import { Transport } from '@nestjs/microservices'
import f from 'lodash/fp'

export interface MicroserviceOptions {
  queues: string[]
}

export const setupMicroservice = (options: MicroserviceOptions) => {
  return async (app: INestApplication): Promise<INestApplication> => {
    const servers = f.pipe(
      f.get('NATS_SERVERS'),
      f.split(','),
      f.map(f.trim),
    )(process.env)

    for (const queue of options.queues) {
      app.connectMicroservice({
        transport: Transport.NATS,
        options: {
          servers,
          queue,
        },
      })
    }

    await app.startAllMicroservices()

    return app
  }
}
