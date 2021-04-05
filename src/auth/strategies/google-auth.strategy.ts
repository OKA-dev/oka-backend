import { Injectable, UnauthorizedException } from "@nestjs/common"
import { AppConfigService } from "src/appconfig/app.config.service"
import { OAuth2Client } from 'google-auth-library'
import * as moment from 'moment'
import { UserAccountType } from "src/data/userdata/user.schema"

@Injectable()
export class GoogelAuthStrategy {
  private oauthClient
  private clientId

  constructor(
    appConfig: AppConfigService,
  ) {
    this.clientId = appConfig.googleAuthClientId
    this.oauthClient = new OAuth2Client({ clientId: this.clientId })
  }

  async validate(token: string): Promise<any> {
    const ticket = await this.oauthClient.verifyIdToken({
      idToken: token,
      audience: this.clientId,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    })
    const payload = ticket.getPayload()

    // aud is client id
    // iss = accounts.google.com
    // exp is in the future
    let aud = payload.aud
    let iss = payload.iss
    let exp = payload.exp

    if (aud !== this.clientId) {
      console.log('clientId real= ', this.clientId)
      console.log('clientID aud = ', aud)
      throw new UnauthorizedException('Invalid google authentication. Client id')
    }

    if (iss !== 'accounts.google.com' && iss !== 'https://accounts.google.com') {
      throw new UnauthorizedException('Invalid google authentication. Source invalid')
    }

    var expiry = moment.unix(exp)
    var now = moment()
    if (expiry.isBefore(now)) {
      throw new UnauthorizedException('Invalid google authentication. Auth expired')
    }

    if (!(payload.email && payload.given_name)) {
      throw new UnauthorizedException('Invalid google authentication. Could not retrieve email or given name')
    }

    return payload
  }

  async processPayloadForSignup(payload: any): Promise<any> {
    const email = payload.email
    const userObject = {
      sub: payload.id,
      email, 
      firstname: payload.given_name,
      lastname: payload.family_name,
      name: payload.name,
      signupType: UserAccountType.Google,
      emailVerified: payload.email_verified,
    }

    return userObject
  }

}