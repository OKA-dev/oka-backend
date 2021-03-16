import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from './auth.service'
import { LocalStrategy } from './strategies/local.strategy'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { AppConfigService } from 'src/appconfig/app.config.service'
import { AppconfigModule } from 'src/appconfig/appconfig.module'
import { JwtStrategy } from './strategies/jwt.strategy'
import { JwtAuthGuard } from './guards/jwt.auth.guard'
import { RolesGuard } from './guards/roles.guard'
import { UserEndpointModule } from 'src/endpoints/user/user.endpoint.module'
import { UserDataModule } from 'src/data/userdata/user.data.module'
import { JwtRefreshStrategy } from './strategies/jwt-refresh-strategy'

@Module({
  imports: [
    UserEndpointModule,
    UserDataModule,
    AppconfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [AppconfigModule],
      useFactory: async (configService: AppConfigService) => ({
        secret: configService.jwtSecret,
        signOptions: { expiresIn: '12h' },
      }),
      inject: [AppConfigService],
    }),
  ],
  exports: [AuthService],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshStrategy,
    { provide: 'APP_GUARD', useClass: JwtAuthGuard },
    { provide: 'APP_GUARD', useClass: RolesGuard },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
