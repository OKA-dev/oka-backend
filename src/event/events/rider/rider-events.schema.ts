import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import { User } from 'src/data/userdata/user.schema'

export type RiderCreatedEventDocument = RiderCreatedEvent & mongoose.Document

@Schema()
export class RiderCreatedEvent {
  kind: string
  time: Date

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name, required: true })
  rider: User

  constructor(rider: User) {
    this.rider = rider
  }
}

export const RiderCreatedEventSchema = SchemaFactory.createForClass(
  RiderCreatedEvent,
)
