import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { User } from 'src/user/user.schema'
import * as mongoose from 'mongoose'

export type UserCreatedEventDocument = UserCreatedEvent & mongoose.Document

@Schema()
export class UserCreatedEvent {
  kind: string
  time: Date

  @Prop({ type: mongoose.Types.ObjectId, ref: User.name, required: true })
  user: User
}

export const UserCreatedEventSchema = SchemaFactory.createForClass(
  UserCreatedEvent,
)
