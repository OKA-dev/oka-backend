import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import { RiderCreatedEvent } from './events/rider/rider-events.schema'
import { UserCreatedEvent } from './events/user/user-events.schema'

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
