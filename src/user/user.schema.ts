import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { phoneType, TimedLocation, timedLocationType } from './location.types'
import { PhoneNumber } from './phonenumber'

export type UserDocument = User & Document

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  email: string

  @Prop({ select: false })
  password: string

  @Prop({ type: phoneType, required: true })
  phone: PhoneNumber

  @Prop({ type: Boolean, default: false })
  phoneNumberConfirmed: boolean

  @Prop([String])
  roles: string[] // should be enum array

  @Prop({ type: Boolean, default: false })
  isActiveRider: boolean

  @Prop({ type: timedLocationType, required: false })
  lastKnownLocation: TimedLocation

  @Prop({
    type: String,
    required: true,
    enum: ['email', 'google', 'facebook'],
    default: 'email',
  })
  accountType: string
}

export const UserSchema = SchemaFactory.createForClass(User)