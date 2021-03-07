import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose'
import { Delivery } from "src/data/deliverydata/delivery.schema";
import { User } from "src/data/userdata/user.schema";

@Schema()
export class DeliveryCreatedEvent {
  kind: string
  time: Date

  @Prop({type: mongoose.Types.ObjectId, ref: Delivery.name})
  delivery: Delivery

  constructor(delivery: Delivery) {
    this.delivery = delivery
  }
}

export const DeliveryCreatedEventSchema = SchemaFactory.createForClass(
  DeliveryCreatedEvent,
)

type UserRef = string | mongoose.Types.ObjectId | User
@Schema()
export class DeliveryCancelledEvent {
  kind: string
  time: Date

  @Prop({type: mongoose.Types.ObjectId, ref: Delivery.name})
  delivery: Delivery

  @Prop({ type: String, required: true})
  reason?: string

  @Prop({ type: mongoose.Types.ObjectId, ref: User.name })
  cancelledBy?: UserRef

  constructor(delivery: Delivery, reason?: string, cancelledBy?: UserRef) {
    this.delivery = delivery
    this.reason = reason
    this.cancelledBy = cancelledBy
  }
}

export const DeliveryCancelledEventSchema = SchemaFactory.createForClass(
  DeliveryCancelledEvent,
)

@Schema()
export class DeliveryRiderCancelledEvent {
  kind: string
  time: Date

  @Prop({type: mongoose.Types.ObjectId, ref: Delivery.name})
  delivery: Delivery

  @Prop({ type: String, required: true})
  reason?: string

  @Prop({ type: mongoose.Types.ObjectId, ref: User.name })
  cancelledBy?: UserRef

  constructor(delivery: Delivery, reason?: string, cancelledBy?: UserRef) {
    this.delivery = delivery
    this.reason = reason
    this.cancelledBy = cancelledBy
  }
}

export const DeliveryRiderCancelledEventSchema = SchemaFactory.createForClass(
  DeliveryRiderCancelledEvent,
)

@Schema()
export class DeliveryConfirmedEvent {
  kind: string
  time: Date

  @Prop({type: mongoose.Types.ObjectId, ref: Delivery.name})
  delivery: Delivery

  constructor(delivery: Delivery) {
    this.delivery = delivery
  }
}

export const DeliveryConfirmedEventSchema = SchemaFactory.createForClass(
  DeliveryConfirmedEvent,
)

@Schema()
export class DeliveryPickedUpEvent {
  kind: string
  time: Date

  @Prop({type: mongoose.Types.ObjectId, ref: Delivery.name})
  delivery: Delivery

  constructor(delivery: Delivery) {
    this.delivery = delivery
  }
}

export const DeliveryPickedUpEventSchema = SchemaFactory.createForClass(
  DeliveryPickedUpEvent,
)

@Schema()
export class DeliveryDroppedOffEvent {
  kind: string
  time: Date

  @Prop({type: mongoose.Types.ObjectId, ref: Delivery.name})
  delivery: Delivery

  constructor(delivery: Delivery) {
    this.delivery = delivery
  }
}

export const DeliveryDroppedOffEventSchema = SchemaFactory.createForClass(
  DeliveryDroppedOffEvent,
)

@Schema()
export class DeliveryProblemEvent {
  kind: string
  time: Date
  message: string

  @Prop({type: mongoose.Types.ObjectId, ref: Delivery.name})
  delivery: Delivery

  constructor(delivery: Delivery, message: string) {
    this.delivery = delivery
    this.message = message
  }
}

export const DeliveryProblemEventSchema = SchemaFactory.createForClass(
  DeliveryProblemEvent,
)

@Schema()
export class DeliveryRiderProblemEvent {
  kind: string
  time: Date
  message: string

  @Prop({type: mongoose.Types.ObjectId, ref: Delivery.name})
  delivery: Delivery

  constructor(delivery: Delivery, message: string) {
    this.delivery = delivery
    this.message = message
  }
}

export const DeliveryRiderProblemEventSchema = SchemaFactory.createForClass(
  DeliveryRiderProblemEvent,
)

export type DeliveryCreatedEventDocument = DeliveryCreatedEvent & mongoose.Document
export type DeliveryCancelledEventDocument = DeliveryCancelledEvent & mongoose.Document
export type DeliveryRiderCancelledEventDocument = DeliveryRiderCancelledEvent & mongoose.Document
export type DeliveryConfirmedEventDocument = DeliveryConfirmedEvent & mongoose.Document
export type DeliveryPickedUpEventDocument = DeliveryPickedUpEvent & mongoose.Document
export type DeliveryDroppedOffEventDocument = DeliveryDroppedOffEvent & mongoose.Document
export type DeliveryProblemEventDocument = DeliveryProblemEvent & mongoose.Document
export type DeliveryRiderProblemEventDocument = DeliveryRiderProblemEvent & mongoose.Document
