import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { User } from 'src/user/user.schema'
import * as mongoose from 'mongoose'

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
