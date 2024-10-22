import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose'
import { Delivery } from "src/data/deliverydata/delivery.schema";
import { User } from "src/data/userdata/user.schema";

@Schema()
export class DeliveryCreatedEvent {
  kind: string
  time: Date

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: Delivery.name})
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

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: Delivery.name})
  delivery: Delivery

  @Prop({ type: String, required: true})
  reason?: string

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
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
export class DeliveryRiderCancelEvent {
  kind: string
  time: Date

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: Delivery.name})
  delivery: Delivery

  @Prop({ type: String, required: true})
  reason?: string

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  cancelledBy?: UserRef

  constructor(delivery: Delivery, reason?: string, cancelledBy?: UserRef) {
    this.delivery = delivery
    this.reason = reason
    this.cancelledBy = cancelledBy
  }
}

export const DeliveryRiderCancelEventSchema = SchemaFactory.createForClass(
  DeliveryRiderCancelEvent,
)

@Schema()
export class DeliveryRiderAcceptedEvent {
  kind: string
  time: Date

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: Delivery.name})
  delivery: Delivery

  constructor(delivery: Delivery) {
    this.delivery = delivery
  }
}

export const DeliveryRiderAcceptedEventSchema = SchemaFactory.createForClass(
  DeliveryRiderAcceptedEvent,
)

@Schema()
export class DeliveryRiderPickupEvent {
  kind: string
  time: Date

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: Delivery.name})
  delivery: Delivery

  constructor(delivery: Delivery) {
    this.delivery = delivery
  }
}

export const DeliveryRiderPickupEventSchema = SchemaFactory.createForClass(
  DeliveryRiderPickupEvent,
)

@Schema()
export class DeliveryRiderDropoffEvent {
  kind: string
  time: Date

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: Delivery.name})
  delivery: Delivery

  constructor(delivery: Delivery) {
    this.delivery = delivery
  }
}

export const DeliveryRiderDropoffEventSchema = SchemaFactory.createForClass(
  DeliveryRiderDropoffEvent,
)

@Schema()
export class DeliveryProblemEvent {
  kind: string
  time: Date
  message: string

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: Delivery.name})
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

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: Delivery.name})
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
export type DeliveryRiderCancelledEventDocument = DeliveryRiderCancelEvent & mongoose.Document
export type DeliveryConfirmedEventDocument = DeliveryRiderAcceptedEvent & mongoose.Document
export type DeliveryPickedUpEventDocument = DeliveryRiderPickupEvent & mongoose.Document
export type DeliveryDroppedOffEventDocument = DeliveryRiderDropoffEvent & mongoose.Document
export type DeliveryProblemEventDocument = DeliveryProblemEvent & mongoose.Document
export type DeliveryRiderProblemEventDocument = DeliveryRiderProblemEvent & mongoose.Document
