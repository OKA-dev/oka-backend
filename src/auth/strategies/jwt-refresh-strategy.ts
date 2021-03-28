import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AppConfigService } from "src/appconfig/app.config.service";
import { UserService } from "src/data/userdata/user.service";
import { JwtService } from '@nestjs/jwt'
import { Hasher } from "src/common/util/hasher";

@Injectable()
export class JwtRefreshStrategy extends  PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(
    private appConfig: AppConfigService,
    private userService: UserService,
    private jwtService: JwtService,
    ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfig.jwtSecret,
      passReqToCallback: true,
    })
  }

  async validate(refreshToken: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(refreshToken)
      const user = await this.userService.findRefreshToken(payload.sub)
      const match = await Hasher.compare(refreshToken, user.hashedRefreshToken)
      if (match) {
        return user
      } 
      return null
    } catch (error) {
      console.error('caught error: ', error)
      return null
    }
  }
}