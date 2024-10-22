import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { GlobalEventListener } from './event.listener'
import { Event, EventSchema } from './event.schema'
import {
  RiderCreatedEvent,
  RiderCreatedEventSchema,
} from './events/rider/rider-events.schema'
import {
  UserCreatedEvent,
  UserCreatedEventSchema,
} from './events/user/user-events.schema'
import { EventService } from './event.service';
import { UserDataModule } from 'src/data/userdata/user.data.module'
import { CommonModule } from 'src/common/common.module'
import { 
  DeliveryCancelledEvent, 
  DeliveryCancelledEventSchema, 
  DeliveryRiderAcceptedEvent, 
  DeliveryRiderAcceptedEventSchema, 
  DeliveryCreatedEvent, 
  DeliveryCreatedEventSchema,
  DeliveryRiderDropoffEvent, 
  DeliveryRiderDropoffEventSchema, 
  DeliveryRiderPickupEvent, 
  DeliveryRiderPickupEventSchema,
  DeliveryProblemEvent,
  DeliveryProblemEventSchema,
  DeliveryRiderCancelEvent,
  DeliveryRiderCancelEventSchema,
  DeliveryRiderProblemEvent,
  DeliveryRiderProblemEventSchema
} from './events/delivery/delivery-events.schema'

@Module({
  imports: [
    UserDataModule,
    CommonModule,
    MongooseModule.forFeature([
      {
        name: Event.name,
        schema: EventSchema,
        discriminators: [
          {name: UserCreatedEvent.name, schema: UserCreatedEventSchema},
          {name: RiderCreatedEvent.name, schema: RiderCreatedEventSchema},
          {name: DeliveryCreatedEvent.name, schema: DeliveryCreatedEventSchema},
          {name: DeliveryCancelledEvent.name, schema: DeliveryCancelledEventSchema},
          {name: DeliveryRiderCancelEvent.name, schema: DeliveryRiderCancelEventSchema},
          {name: DeliveryRiderAcceptedEvent.name, schema: DeliveryRiderAcceptedEventSchema},
          {name: DeliveryRiderPickupEvent.name, schema: DeliveryRiderPickupEventSchema},
          {name: DeliveryRiderDropoffEvent.name, schema: DeliveryRiderDropoffEventSchema},
          {name: DeliveryProblemEvent.name, schema: DeliveryProblemEventSchema},
          {name: DeliveryRiderProblemEvent.name, schema: DeliveryRiderProblemEventSchema},
        ],
      },
    ]),
  ],
  providers: [GlobalEventListener, EventService],
})
export class EventModule {}
