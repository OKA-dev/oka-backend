import { Global, HttpModule, Module } from '@nestjs/common'
import { AppconfigModule } from 'src/appconfig/appconfig.module'
import { VerificationDataModule } from 'src/data/verifications/verification.data.module'
import { CloudStorageService } from './services/cloud-storage.service'
import { DeliveryCoordinatorService } from './services/delivery-coordinator.service'
import { PushNotificationService } from './services/push-notification.service'
import { SmsMessagingService } from './services/sms-messaging.service'
import { SmsVerificationService } from './services/sms-verification.service'
import { TwilioVerificationService } from './services/twilio-verification.service'

@Global()
@Module({
  imports: [AppconfigModule, VerificationDataModule, HttpModule],
  providers: [
    CloudStorageService, 
    PushNotificationService, 
    SmsMessagingService, 
    SmsVerificationService,
    TwilioVerificationService,
    DeliveryCoordinatorService,
  ],
  exports: [
    CloudStorageService, 
    PushNotificationService, 
    SmsMessagingService, 
    SmsVerificationService,
    TwilioVerificationService,
    DeliveryCoordinatorService,
  ],
})
export class CommonModule {}
