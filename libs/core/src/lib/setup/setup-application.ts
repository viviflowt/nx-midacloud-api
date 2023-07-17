import { getUrl, isDevelopmentOrTest } from '@mida/common'
import { INestApplication, VersioningType } from '@nestjs/common'
import { RequestMethod } from '@nestjs/common/enums/request-method.enum'
import { Logger } from '@nestjs/common/services/logger.service'
import {
  DocumentBuilder,
  OpenAPIObject,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger'
import { Request } from 'express'
import morgan from 'morgan'

const DEFAULT_GLOBAL_PREFIX = 'api'
const DEFAULT_SWAGGER_PATH = 'api-docs'
const DEFAULT_SWAGGER_JSON_PATH = 'api-json'
const DEFAULT_SWAGGER_YAML_PATH = 'api-yaml'
const DEFAULT_API_VERSION = '1'
const DEFAULT_API_PREFIX = 'v'

const configureGlobalPrefix = async (app: INestApplication): Promise<void> => {
  app.setGlobalPrefix(DEFAULT_GLOBAL_PREFIX, {
    exclude: [
      { path: 'health', method: RequestMethod.ALL },
      { path: 'api-json', method: RequestMethod.ALL },
      { path: 'api-yaml', method: RequestMethod.ALL },
      { path: 'api-docs', method: RequestMethod.ALL },
    ],
  })
}

const configureVersioning = async (app: INestApplication): Promise<void> => {
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: DEFAULT_API_VERSION,
    prefix: DEFAULT_API_PREFIX,
  })
}

const configureMorgan = async (app: INestApplication): Promise<void> => {
  const profile = isDevelopmentOrTest() ? 'dev' : 'common'

  app.use(
    morgan(profile, {
      skip: (request: Request): boolean => {
        return (
          getUrl(request).includes('health') ||
          getUrl(request).includes('api-docs') ||
          getUrl(request).includes('api-json') ||
          getUrl(request).includes('api-yaml')
        )
      },
    }),
  )
}

const createSwaggerDocument = (app: INestApplication): OpenAPIObject => {
  return SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle(process.env['npm_package_name'] ?? 'Swagger')
      .setDescription(
        process.env['npm_package_description'] ?? 'API documentation',
      )
      .setVersion(process.env['npm_package_version'] ?? '')
      .addBearerAuth()
      .build(),
  )
}

const createSwaggerOptions = (): SwaggerCustomOptions => {
  return {
    jsonDocumentUrl: DEFAULT_SWAGGER_JSON_PATH,
    yamlDocumentUrl: DEFAULT_SWAGGER_YAML_PATH,
    explorer: true,
    useGlobalPrefix: false,
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
      operationsSorter: 'alpha',
      tagsSorter: 'alpha',
      displayOperationId: false,
    },
  }
}

export const configureSwagger = async (
  app: INestApplication,
): Promise<void> => {
  SwaggerModule.setup(
    DEFAULT_SWAGGER_PATH,
    app,
    createSwaggerDocument(app),
    createSwaggerOptions(),
  )
}

export const setupApplication = async (
  app: INestApplication,
): Promise<INestApplication> => {
  await configureGlobalPrefix(app)
  await configureVersioning(app)
  await configureMorgan(app)
  await configureSwagger(app)

  app
    .getHttpAdapter()
    .getHttpServer()
    .on('listening', () => {
      Logger.log(
        `Listening on port ${
          app.getHttpAdapter().getHttpServer().address().port
        }`,
      )
    })

  return app
}
