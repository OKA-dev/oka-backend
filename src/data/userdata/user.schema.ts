import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import { Role } from 'src/common/role.enum'
import { phoneType, timedLocationType, TimedLocation } from '../addressdata/location.types'
import { PhoneNumber } from '../addressdata/phonenumber'

export enum UserAccountType {
  Email = 'email',
  Google = 'google',
  Facebook = 'facebook',
  Apple = 'apple',
}

export type UserDocument = User & mongoose.Document

@Schema({ timestamps: true })
export class User {
  // @Prop({ type: mongoose.Types.ObjectId })
  _id: string

  @Prop({ required: true })
  name: string

  @Prop({ required: true, unique: true })
  email: string

  @Prop({ select: false })
  password: string

  @Prop({ type: phoneType, required: true })
  phone: PhoneNumber

  @Prop({ type: Boolean, default: false })
  phoneNumberConfirmed: boolean

  @Prop({ type: [String], default: [Role.User] })
  roles: Role[]

  @Prop({ type: Boolean, default: false })
  isActiveRider: boolean

  @Prop({ type: Boolean, default: false })
  isActive: boolean

  @Prop({ type: timedLocationType, required: false })
  lastKnownLocation: TimedLocation

  @Prop({
    type: String,
    required: true,
    enum: Object.values(UserAccountType),
    default: UserAccountType.Email
  })
  accountType: string
}

export const UserSchema = SchemaFactory.createForClass(User)
