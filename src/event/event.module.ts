import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { GlobalEventListener } from './event.listener'
import { Event, EventSchema } from './event.schema'
import {
  RiderCreatedEvent,
  RiderCreatedEventSchema,
} from './rider-created-event.schema'
import {
  UserCreatedEvent,
  UserCreatedEventSchema,
} from './user-created-event.schema'
import { EventService } from './event.service';
import { UserDataModule } from 'src/models/userdata/user.data.module'

@Module({
  imports: [
    UserDataModule,
    MongooseModule.forFeature([
      {
        name: Event.name,
        schema: EventSchema,
        discriminators: [
          { name: UserCreatedEvent.name, schema: UserCreatedEventSchema },
          { name: RiderCreatedEvent.name, schema: RiderCreatedEventSchema },
        ],
      },
      // TODO: use discriminators instead of registering schemas independently
      // { name: UserCreatedEvent.name, schema: UserCreatedEventSchema },
      // { name: RiderCreatedEvent.name, schema: RiderCreatedEventSchema },
    ]),
  ],
  providers: [GlobalEventListener, EventService],
})
export class EventModule {}
