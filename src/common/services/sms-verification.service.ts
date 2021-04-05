import { ForbiddenException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { PhoneNumber } from 'src/data/addressdata/phonenumber';
import { VerificationDataService } from 'src/data/verifications/verification.data.service';
import { Verification, VerificationStatus } from 'src/data/verifications/verification.schema';
import { SmsMessagingService } from './sms-messaging.service';
import { VerificationService } from './verification.service'

@Injectable()
export class SmsVerificationService implements VerificationService {
  maxChecks = 3
  constructor(
    private verificationData: VerificationDataService,
    private smsService: SmsMessagingService,
    ) {}

  async startVerification(phoneNumber: PhoneNumber): Promise<Verification> {
    const code = this.randomInt(10 ** 5 + 1, 10 ** 6 - 1).toString()
    const v = {
      phone: phoneNumber,
      code: code,
    }
    const verificationObject = await this.verificationData.create(v)
    const message = `Your OKA verification code is ${v.code}`
    await this.smsService.sendSMS(phoneNumber.e164, message)
    return verificationObject
  }

  async verify(id: string, verificationCode: string) {
    const verification = await this.verificationData.findById(id)
    if (verification.status != VerificationStatus.Pending) {
      throw new ForbiddenException('Verification is not pending.')
    }
    if (verification.timesChecked >= this.maxChecks) {
      throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS)
    }
    verification.timesChecked += 1
    if (verification.code == verificationCode) {
      await this.verificationData.updateById(id, {
        status: VerificationStatus.Approved, 
        timesChecked: verification.timesChecked
      })
      return {status: 'approved', e164: verification.phone.e164}
    } else {
      await this.verificationData.updateById(id, {
        timesChecked: verification.timesChecked
      }) 
      throw new UnauthorizedException('Incorrect code.')
    }
  }
  
  private randomInt(low, high): number {
    return Math.floor(Math.random() * (high - low) + low);
  }
}