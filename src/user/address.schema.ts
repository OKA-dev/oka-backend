import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import * as mongoose from 'mongoose'
import { User } from 'src/user/user.schema'

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
  country: string

  @Prop()
  isDefault: boolean
}

export const AddressSchema = SchemaFactory.createForClass(Address)
