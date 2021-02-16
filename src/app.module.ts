import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { UserModule } from './user/user.module'
import { DeliveriesModule } from './deliveries/deliveries.module'
import { AdminModule } from './admin/admin.module'
import { AuthModule } from './auth/auth.module'
import { GlobalModule } from './global/global.module'
import { AppConfigService } from './app.config.service'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { logger } from './global/util/logger'

let envFilePath = '.env'
const ENV = process.env.NODE_ENV
if (ENV == 'development') {
  envFilePath = '.development.env'
} else if (ENV == 'staging') {
  envFilePath = '.staging.env'
}
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: envFilePath,
      isGlobal: true,
      cache: true,
    }),
    MongooseModule.forRootAsync({
      imports: [AppModule],
      useFactory: async (configService: AppConfigService) => ({
        uri: configService.dbUri,
        useCreateIndex: true,
      }),
      inject: [AppConfigService],
    }),
    UserModule,
    DeliveriesModule,
    AdminModule,
    AuthModule,
    GlobalModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppConfigService],
  exports: [AppConfigService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(logger).forRoutes('*')
  }
}
