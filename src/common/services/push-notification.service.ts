import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { AppConfigService } from 'src/appconfig/app.config.service'
import { PushMessage } from '../models/push-message'

@Injectable()
export class PushNotificationService {

  private pushServerUrl = 'https://onesignal.com/api/v1/notifications'

  constructor(private httpService: HttpService, private config: AppConfigService) {}

  async sendMessage(message: PushMessage, userIds: string[]) {

    const payload = { 
      app_id: this.config.oneSignalAppId,
      title: {'en': message.title },
      contents: {'en': message.contents },
      channel_for_external_user_ids: 'push',
      include_external_user_ids: userIds
    }
    await this.httpService.post(this.pushServerUrl, JSON.stringify(payload)).toPromise()
  }
}