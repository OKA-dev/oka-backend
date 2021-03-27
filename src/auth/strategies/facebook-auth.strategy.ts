import { BadRequestException, HttpService, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Profile, Strategy } from "passport-facebook";
import { AppConfigService } from "src/appconfig/app.config.service";
import { Role } from "src/common/role.enum";
import { UserAccountType } from "src/data/userdata/user.schema";
import { UserService } from "src/data/userdata/user.service";

@Injectable()
export class FacebookAuthStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    appConfig: AppConfigService,
    private http: HttpService,
    private userService: UserService,
  ) {
    super({
      clientID: appConfig.facebookAppId,
      clientSecret: appConfig.facebookAppSecret,
      callbackURL: "http://localhost:4200/facebook/redirect",
      scope: 'email',
      profileFields: ['emails', 'name']
    })
  }

  async authenticate(req: Request) {
    console.log('authenticating request: ', req)
    const result = super.authenticate(req)
    console.log('facebook auth result = ', result)
    return result
  }

  async process(accessToken: string): Promise<any>{
    const graphBase = `https://graph.facebook.com/me?fields=email,id,name&access_token=${accessToken}`
    console.log(`getting: ${graphBase}`)
    const payload = await this.http.get(graphBase).toPromise().then( r => r.data).catch(err => {throw err})
    console.log('payload = ', payload)
    if (!payload || !payload.email || ! payload.id || !payload.name) {
      console.error('missing field')
      throw new BadRequestException('Invalid token')
    }

    const userObject = {
      sub: payload.id,
      email: payload.email, 
      firstname: payload.first_name,
      lastname: payload.last_name,
      name: payload.name,
      signupType: UserAccountType.Facebook,
      emailVerified: true,
      roles: [Role.User],
      accountType: UserAccountType.Facebook,
    }
    console.log(`returning userObject: ${userObject}`)
    return userObject
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void
  ): Promise<any> {
    console.log('accessToken = ', accessToken)
    console.log('refreshToken = ', refreshToken)
    console.log('profile = ', profile)
    const { name, emails } = profile;
    const user = {
      email: emails[0].value,
      firstName: name.givenName,
      lastName: name.familyName,
    };
    const payload = {
      user,
      accessToken,
    };

    done(null, payload);
  }

}