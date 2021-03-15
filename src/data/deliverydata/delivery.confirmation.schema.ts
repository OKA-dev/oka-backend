import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import * as mongoose from 'mongoose'
import { Delivery } from './delivery.schema'

export type DeliveryConfirmationDocument = DeliveryConfirmation & mongoose.Document

@Schema({ timestamps: true })
export class DeliveryConfirmation {

  constructor(delivery: Delivery, code: string) {
    this.delivery = delivery
    this.code = code
  }
  
  @Prop({type: mongoose.Schema.Types.ObjectId, ref: Delivery.name, unique: true})
  delivery: Delivery

  @Prop({type: String})
  code: string
}

export const DeliveryConfirmationSchema = SchemaFactory.createForClass(DeliveryConfirmation)
