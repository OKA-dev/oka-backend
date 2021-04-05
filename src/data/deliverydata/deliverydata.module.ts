import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { DeliveryDataService } from 'src/data/deliverydata/delivery.data.service'
import { DeliveryConfirmation, DeliveryConfirmationSchema } from './delivery.confirmation.schema'
import { DeliveryConfirmationService } from './delivery.confirmation.service'
import { Delivery, DeliverySchema } from './delivery.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Delivery.name, schema: DeliverySchema},
      {name: DeliveryConfirmation.name, schema: DeliveryConfirmationSchema},
    ])
  ],
  providers: [DeliveryDataService, DeliveryConfirmationService],
  exports: [DeliveryDataService, DeliveryConfirmationService],
})
export class DeliverydataModule {}
