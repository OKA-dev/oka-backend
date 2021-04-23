import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get dbUri(): string {
    return this.configService.get('DB_URI')
  }

  get jwtSecret(): string {
    return this.configService.get('JWT_SECRET')
  }

  get awsRegion(): string {
    return this.configService.get('AWS_REGION')
  }

  get awsAccessKey(): string {
    return this.configService.get('AWS_ACCESS_KEY')
  }

  get awsSecretKey(): string {
    return this.configService.get('AWS_SECRET_KEY')
  }

  get publicS3Bucket(): string {
    return this.configService.get('AWS_PUBLIC_BUCKET')
  }
  
  get googleAuthClientId(): string {
    return this.configService.get('GOOGLE_AUTH_CLIENT_ID')
  }

  get facebookAppId(): string {
    return this.configService.get('FACEBOOK_APP_ID')
  }

  get facebookAppSecret(): string {
     return this.configService.get('FACEBOOK_APP_SECRET')
  }

  get oneSignalAppId(): string {
    return this.configService.get('ONESIGNAL_APP_ID')
  }
  
  get twilioAccountSID(): string {
    return this.configService.get('TWILIO_ACCOUNT_SID')
  }

  get twilioVerifySID(): string {
    return this.configService.get('TWILIO_VERIFY_SID')
  }

  get twilioAccountAuthToken(): string {
    return this.configService.get('TWILIO_AUTH_TOKEN')
  }

  get twilioPhoneNumber(): string {
    return this.configService.get('TWILIO_PHONE_NUMBER')
  }

  get twilioMessagingServiceId(): string {
    return this.configService.get('TWILIO_MESSAGING_SERVICE_SID')
  }

  get verificationService(): string {
    return this.configService.get('VERIFICATION_SERVICE')
  }
}
