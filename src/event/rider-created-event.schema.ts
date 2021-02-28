import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import { User } from 'src/data/userdata/user.schema'

export type RiderCreatedEventDocument = RiderCreatedEvent & mongoose.Document

@Schema()
export class RiderCreatedEvent {
  kind: string
  time: Date

  @Prop({ type: mongoose.Types.ObjectId, ref: User.name, required: true })
  rider: User
}

export const RiderCreatedEventSchema = SchemaFactory.createForClass(
  RiderCreatedEvent,
)
