import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { TimedLocation } from "../addressdata/location.types";
import { User } from "../userdata/user.schema";
import * as mongoose from 'mongoose'
import { pointType } from "src/common/models/geojson";
import { Address, pointSchema } from "../addressdata/address.schema";

export type DeliveryDocument = Delivery & mongoose.Document

export enum DeliveryStatus {
  Pending = 'Pending',
  Confirmed = 'Confirmed',
  EnRoute = 'En-route',
  Delivered = 'Delivered',
  Cancelled = 'Cancelled',
  Issue = 'Issue',
}

export enum DeliveryProblemType {
  Loss = 'loss',
  Theft = 'theft',
  Accident = 'accident',
  Other = 'other',
}

const timedLocationType = {
  timestamp: { type: Date, required: true, default: Date.now() },
  geolocation: { type: pointType },
}

const timedLocationSchema = new mongoose.Schema({
  timestamp: Date,
  location: pointSchema
}, { _id: false })


const deliveryAddressSchema = new mongoose.Schema({
  label: String,
  line1: String,
  line2: String,
  city: String,
  state: String,
  country: String,
  location: pointSchema,
})

const deliveryProblemSchema = new mongoose.Schema({
  type: { type: String, enum: Object.values(DeliveryProblemType) },
  message: String,
  createdByRider: { type: Boolean, default: false },
  resolved: { type: Boolean, default: false},
}, { timestamps: true })

export interface DeliveryProblem {
  type: DeliveryProblemType
  message: string
  createdByRider: boolean
  resolved: boolean
  createdAt: Date
  updatedAt: Date
}
@Schema({ timestamps: true })
export class Delivery {
  _id: string

  @Prop({ type: deliveryAddressSchema })
  start: Address

  @Prop({ type: deliveryAddressSchema })
  end: Address

  @Prop({ type: [timedLocationSchema] })
  route?: TimedLocation[]
  
  @Prop({type: [String]})
  labels: string[]

  @Prop({ 
    type: String,
    required: true,
    enum: Object.values(DeliveryStatus),
    default: DeliveryStatus.Pending,
  })
  status: DeliveryStatus

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: User.name})
  sender: User

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: User.name})
  rider?: User

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: User.name})
  recipient?: User

  @Prop({type: deliveryProblemSchema, required: false})
  problem?: DeliveryProblem

  @Prop({type:Boolean, default: false})
  archived: boolean
}

export const DeliverySchema = SchemaFactory.createForClass(Delivery)
