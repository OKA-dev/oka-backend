import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AppConfigService } from "src/appconfig/app.config.service";
import { Role } from "src/common/role.enum";

@Injectable()
export default class JwtFederatedStrategy extends PassportStrategy(Strategy) {
  constructor(private appConfig: AppConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfig.jwtSecret,
    })
  }
    
  validate(payload: any) {
    if (payload.roles != [Role.Signup]) {
      throw new UnauthorizedException()
    }
    return payload
  }
}