import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import * as mongoose from 'mongoose'
import { User } from 'src/user/user.schema'
import { Point } from 'src/global/models/geojson'
import { pointType } from './location.types'


export const pointSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
}, { _id: false })

export type AddressDocument = Address & Document

@Schema({ timestamps: true })
export class Address {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: User

  @Prop()
  label: string

  @Prop()
  line1: string

  @Prop()
  line2?: string

  @Prop()
  city: string

  @Prop()
  state?: string

  @Prop()
  postalCode?: string

  @Prop()
  country: string

  @Prop({ default: false })
  isDefault: boolean

  @Prop({ type: pointSchema })
  location: Point
}

export const AddressSchema = SchemaFactory.createForClass(Address)
