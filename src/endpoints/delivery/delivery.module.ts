import { Module } from '@nestjs/common';
import { DeliverydataModule } from 'src/data/deliverydata/deliverydata.module';
import { DeliveryController } from './delivery.controller';

@Module({
  imports: [DeliverydataModule],
  controllers: [DeliveryController],
})
export class DeliveryModule {}
