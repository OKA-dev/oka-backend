import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import { PhoneNumber } from '../addressdata/phonenumber'
import * as moment from 'moment'
import { phoneType } from '../addressdata/location.types'

export enum VerificationStatus {
  Pending = 'pending',
  Approved = 'approved',
  Declined = 'declined',
}

export type VerificationDocument = Verification & mongoose.Document
@Schema({timestamps: true})
export class Verification {
  _id: string

  @Prop({type: phoneType})
  phone: PhoneNumber

  @Prop({type: String, required: true})
  code: string

  @Prop({type: String, enum: Object.values(VerificationStatus), default: VerificationStatus.Pending})
  status: VerificationStatus

  @Prop({type: Number, default: 0})
  timesChecked: number

  @Prop({ type: Date, default: moment().add(15, 'minutes').toDate() })
  expires: Date
}

export const VerificationSchema = SchemaFactory.createForClass(Verification)
