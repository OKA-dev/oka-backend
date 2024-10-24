import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AdminEndpointModule } from './endpoints/admin/admin.endpoint.module'
import { AuthModule } from './auth/auth.module'
import { CommonModule } from './common/common.module'
import { AppConfigService } from './appconfig/app.config.service'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { ThrottlerModule } from '@nestjs/throttler'
import { logger } from './common/util/logger'
import { AppconfigModule } from './appconfig/appconfig.module';
import { EventModule } from './event/event.module';
import { EventEmitterModule } from '@nestjs/event-emitter'
import { UserEndpointModule } from './endpoints/user/user.endpoint.module';
import { UserDataModule } from './data/userdata/user.data.module';
import { AddressDataModule } from './data/addressdata/address.data.module';
import { DeliverydataModule } from './data/deliverydata/deliverydata.module';
import { DeliveryModule } from './endpoints/delivery/delivery.module';
import { RiderEndpointModule } from './endpoints/rider/rider.endpoint.module';
import { VerificationDataModule } from './data/verifications/verification.data.module'
import { CountryDataModule } from './data/countrydata/country.data.module'
import { CountryEndpointModule } from './endpoints/country/country.endpoint.module'

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
    ThrottlerModule.forRoot([{
      name: 'short',
      ttl: 1000,
      limit: 5,
    },
    {
      name: 'medium',
      ttl: 10000,
      limit: 20
    },
    {
      name: 'long',
      ttl: 60000,
      limit: 500
    }
  ]),
    MongooseModule.forRootAsync({
      imports: [AppconfigModule],
      useFactory: async (configService: AppConfigService) => ({
        uri: configService.dbUri,
        // useCreateIndex: true,
        // useFindAndModify: false,
      }),
      inject: [AppConfigService],
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    CommonModule,
    UserEndpointModule,
    AdminEndpointModule,
    CountryEndpointModule,
    AuthModule,
    AppconfigModule,
    EventModule,
    UserDataModule,
    VerificationDataModule,
    AddressDataModule,
    CountryDataModule,
    DeliverydataModule,
    DeliveryModule,
    RiderEndpointModule,
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
