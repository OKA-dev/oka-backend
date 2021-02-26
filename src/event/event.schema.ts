import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import { RiderCreatedEvent } from './rider-created-event.schema'
import { UserCreatedEvent } from './user-created-event.schema'

export type EventDocument = Event & mongoose.Document

@Schema({ discriminatorKey: 'kind' })
export class Event {
  @Prop({
    type: String,
    required: true,
    enum: [UserCreatedEvent.name, RiderCreatedEvent.name],
  })
  kind: string

  @Prop({ type: Date, required: true, default: Date() })
  time: Date
}

export const EventSchema = SchemaFactory.createForClass(Event)
// registerEventDiscriminator()
// export enum EventKind {
//   UserCreated = 'usercreated',
//   RiderCreated = 'ridercreated',
// }

// function registerEventDiscriminator(arr: mongoose.Schema.Types.DocumentArray) {
//   arr.discriminator(EventKind.UserCreated, UserCreatedEventSchema)
//   arr.discriminator(EventKind.RiderCreated, RiderCreatedEventSchema)
// }
