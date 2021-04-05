import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { AppConfigService } from "src/appconfig/app.config.service";
import { VerificationService } from "./verification.service";
import { Twilio } from 'twilio'
import { PhoneNumber } from "src/data/addressdata/phonenumber";

@Injectable()
export class TwilioVerificationService implements VerificationService {
  client: Twilio
  constructor(private config: AppConfigService) {
    this.client = new Twilio(config.twilioAccountSID, config.twilioAccountAuthToken)  
  }

  async startVerification(phoneNumber: PhoneNumber) {
    if (!phoneNumber.e164) {
      throw new InternalServerErrorException('Could not determing e164 number')
    }
    const result = await this.client.verify.services(this.config.twilioVerifySID).verifications.create({
      to: phoneNumber.e164,
      channel: 'sms'
    })
    return result
  }

  async verify(sid: any, verificationCode: any) {
    const result: any = await this.client.verify.services(this.config.twilioVerifySID)
    .verificationChecks.create({
      verificationSid: sid,
      code: verificationCode,
    })
    result.id = result.sid
    result.e164 = result.to
    return result
  }

}