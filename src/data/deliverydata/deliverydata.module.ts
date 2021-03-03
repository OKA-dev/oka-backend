import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeliveryService } from 'src/endpoints/delivery/delivery.service';
import { Delivery, DeliverySchema } from './delivery.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Delivery.name, schema: DeliverySchema},
    ])
  ],
  providers: [DeliveryService],
  exports: [DeliveryService],
})
export class DeliverydataModule {}
