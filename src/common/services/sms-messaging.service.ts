import { Injectable } from "@nestjs/common";
import { AppConfigService } from "src/appconfig/app.config.service";
import { Twilio } from 'twilio'
import { MessageInstance } from "twilio/lib/rest/api/v2010/account/message";

@Injectable()
export class SmsMessagingService {
  client: Twilio 

  constructor(private config: AppConfigService) {
    this.client = new Twilio(config.twilioAccountSID, config.twilioAccountAuthToken)
  }

  async sendSMS(phoneNumber: string, message: string): Promise<MessageInstance> {
    const response = await this.client.messages.create({
      from: this.config.twilioPhoneNumber,
      to: phoneNumber,
      body: message
    })
    return response
  }
}