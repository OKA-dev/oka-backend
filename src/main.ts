import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import helmet from 'helmet'
import * as csurf from 'csurf'
import * as rateLimit from 'express-rate-limit'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AllExceptionFilter } from './common/filters/all.exception.filter'
import { config } from 'aws-sdk'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  const configService = app.get(ConfigService)
  app.set('trust proxy', 1)
  app.use(helmet())
  app.enableCors()
  app.useGlobalFilters(new AllExceptionFilter())

  // TODO: acessKeyId and secreateAccessKey are deprecated.
  // replace configuration
  config.update({
    accessKeyId: configService.get('AWS_ACCESS_KEY'),
    secretAccessKey: configService.get('AWS_SECRET_KEY'),
    region: configService.get('AWS_REGION'),
  })
  configureSwagger(app)
  await app.listen(configService.get('PORT_NO'))
  app.use(csurf())
}

function configureSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('OKA Delivery API')
    .setDescription('OKA Delivery Services')
    .setVersion('1.0')
    .addTag('Users')
    .addTag('Riders')
    .addTag('Deliveries')
    .addTag('Admin')
    .addTag('Auth')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)
}

bootstrap()
