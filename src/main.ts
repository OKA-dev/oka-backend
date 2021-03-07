import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'
import * as helmet from 'helmet'
import * as csurf from 'csurf'
import * as rateLimit from 'express-rate-limit'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AllExceptionFilter } from './common/filters/all.exception.filter'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  const configService = app.get(ConfigService)
  app.set('trust proxy', 1)
  app.use(
    rateLimit({
      windowMs: 1 * 30 * 1000,
      max: 30, // limit each IP to 30 requests per windowMs (60 seconds)
    }),
  )
  app.use(helmet())
  app.enableCors()
  app.useGlobalFilters(new AllExceptionFilter())

  configureSwagger(app)
  await app.listen(configService.get('PORT'))
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
