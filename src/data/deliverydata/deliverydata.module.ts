import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { DeliveryService } from 'src/data/deliverydata/delivery.service'
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
  providers: [DeliveryService, DeliveryConfirmationService],
  exports: [DeliveryService, DeliveryConfirmationService],
})
export class DeliverydataModule {}
