import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import { User } from 'src/data/userdata/user.schema'

export type UserCreatedEventDocument = UserCreatedEvent & mongoose.Document

@Schema()
export class UserCreatedEvent {
  kind: string
  time: Date

  constructor(user: User) {
    this.user = user
  }

  @Prop({ type: mongoose.Types.ObjectId, ref: User.name, required: true })
  user: User
}

export const UserCreatedEventSchema = SchemaFactory.createForClass(
  UserCreatedEvent,
)
