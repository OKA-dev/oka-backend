import { Prop, SchemaFactory } from '@nestjs/mongoose'
import { User } from '../userdata/user.schema'
import * as mongoose from 'mongoose'

export enum VehicleType {
  Motorbile = 'Motor Bike',
  Car = 'Car',
  Van = 'Van',
  PickupTruck = 'Pickup Truck'
}

export class Vehicle {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user: User

  @Prop({type: String, enum: Object.values(VehicleType)})
  type: VehicleType

  @Prop({required: true})
  make: string

  @Prop()
  model: string

  @Prop({required: true, unique: true})
  licensePlate: string
}

export type VehicleDocument = Vehicle & mongoose.Document
export const PhotoSchema = SchemaFactory.createForClass(Vehicle)
