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
import { 
  DeliveryCancelledEvent, 
  DeliveryCancelledEventSchema, 
  DeliveryConfirmedEvent, 
  DeliveryConfirmedEventSchema, 
  DeliveryCreatedEvent, 
  DeliveryCreatedEventSchema,
  DeliveryDroppedOffEvent, 
  DeliveryDroppedOffEventSchema, 
  DeliveryPickedUpEvent, 
  DeliveryPickedUpEventSchema,
  DeliveryProblemEvent,
  DeliveryProblemEventSchema,
  DeliveryRiderCancelledEvent,
  DeliveryRiderCancelledEventSchema,
  DeliveryRiderProblemEvent,
  DeliveryRiderProblemEventSchema
} from './events/delivery/delivery-events.schema'

@Module({
  imports: [
    UserDataModule,
    MongooseModule.forFeature([
      {
        name: Event.name,
        schema: EventSchema,
        discriminators: [
          {name: UserCreatedEvent.name, schema: UserCreatedEventSchema},
          {name: RiderCreatedEvent.name, schema: RiderCreatedEventSchema},
          {name: DeliveryCreatedEvent.name, schema: DeliveryCreatedEventSchema},
          {name: DeliveryCancelledEvent.name, schema: DeliveryCancelledEventSchema},
          {name: DeliveryRiderCancelledEvent.name, schema: DeliveryRiderCancelledEventSchema},
          {name: DeliveryConfirmedEvent.name, schema: DeliveryConfirmedEventSchema},
          {name: DeliveryPickedUpEvent.name, schema: DeliveryPickedUpEventSchema},
          {name: DeliveryDroppedOffEvent.name, schema: DeliveryDroppedOffEventSchema},
          {name: DeliveryProblemEvent.name, schema: DeliveryProblemEventSchema},
          {name: DeliveryRiderProblemEvent.name, schema: DeliveryRiderProblemEventSchema},
        ],
      },
    ]),
  ],
  providers: [GlobalEventListener, EventService],
})
export class EventModule {}
