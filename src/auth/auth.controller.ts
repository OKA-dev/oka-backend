import { BadRequestException, Body, Controller, NotFoundException, Post, Request, UnauthorizedException, UseGuards, UsePipes } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { ObjectValidationPipe } from 'src/common/pipes/object.validation.pipe'
import { UserAccountType } from 'src/data/userdata/user.schema'
import { UserDataService } from 'src/data/userdata/user.data.service'
import { AuthService } from './auth.service'
import { FederatedDto, FederatedLoginDtoValidator } from './federated.dto'
import JwtRefreshGuard from './guards/jwt-refresh.guard'
import { LocalAuthGuard } from './guards/local.auth.guard'
import { Public } from './public'
import { SmsVerificationService } from 'src/common/services/sms-verification.service'
import { TwilioVerificationService } from 'src/common/services/twilio-verification.service'
import { VerificationService } from 'src/common/services/verification.service'
import { AppConfigService } from 'src/appconfig/app.config.service'
import { PhoneCheckDto, PhoneCheckDtoValidator, PhoneDto, PhoneDtoValidator } from 'src/common/models/phone.dto'
import { PhoneNumberTransformPipe } from 'src/common/pipes/phone.transform.pipe'


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private verificationService: VerificationService
  
  constructor(
    private authService: AuthService,
    private userService: UserDataService,
    smsVerification: SmsVerificationService,
    twilioVerification: TwilioVerificationService,
    private config: AppConfigService) {
      if (this.config.verificationService == 'sms') {
        this.verificationService = smsVerification
        console.log('**** usign SMS Verification')
      } else {
        this.verificationService = twilioVerification
        console.log('**** usign Twilio Verification')
      }
    }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user)
  }

  @Public()
  @Post('/refresh')
  @UseGuards(JwtRefreshGuard)
  async refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user)
  }

  @Public()
  @Post('/login/federated')
  async federatedLogin(
    @Body(new ObjectValidationPipe(FederatedLoginDtoValidator))body: FederatedDto, 
  ) {
    let userObject
    switch (body.type) {
      case UserAccountType.Facebook:
        userObject = await this.authService.validateFacebookToken(body.token)
        break
      case UserAccountType.Google:
        userObject = await this.authService.validateGoogleToken(body.token)
    }

    if (!userObject || !userObject.email) {
      throw new UnauthorizedException()
    }
    const user = await this.userService.findByEmail(userObject.email)
    if (!user) {
      throw new NotFoundException()
    }

    return await this.authService.login(user)
  }

  @Public()
  @Post('/verify/start')
  @UsePipes(new ObjectValidationPipe(PhoneDtoValidator))
  async startVerification(@Body(PhoneNumberTransformPipe) body: PhoneDto) {
    const phoneNumber = body.phone
    const result = this.verificationService.startVerification(phoneNumber)
    return result
  }

  @Public()
  @Post('/verify/check')
  @UsePipes(new ObjectValidationPipe(PhoneCheckDtoValidator))
  async checkVerification(@Body(PhoneNumberTransformPipe) verification: PhoneCheckDto) {
    const verificationResult = await this.verificationService.verify(verification.id, verification.code)
    if (verificationResult.e164 !== verification.phone.e164) {
      throw new BadRequestException('Phone number submitted does not match our records for this verification.')
    }
    if (verificationResult.status == 'approved') {
      const user = await this.userService.findByPhoneE164(verification.phone.e164) // todo: check real number
      if (user) {
        const session = await this.authService.login(user)
        return {
          type: 'login',
          ...session
        }
      } else {
        const token = await this.authService.jwtSign(verification.phone)
        return {
          type: 'signup',
          token: token,
        }
      }
    }
  }
}

