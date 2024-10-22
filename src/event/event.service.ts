import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import * as mongoose from 'mongoose'
import { Event } from './event.schema'
import { DeliveryCancelledEvent, DeliveryCancelledEventDocument, DeliveryRiderAcceptedEvent, DeliveryConfirmedEventDocument, DeliveryCreatedEvent, DeliveryCreatedEventDocument, DeliveryRiderDropoffEvent, DeliveryDroppedOffEventDocument, DeliveryRiderPickupEvent, DeliveryPickedUpEventDocument, DeliveryRiderPickupEventSchema, DeliveryProblemEvent, DeliveryProblemEventDocument, DeliveryRiderCancelEvent, DeliveryRiderCancelledEventDocument } from './events/delivery/delivery-events.schema'
import {
  RiderCreatedEvent,
  RiderCreatedEventDocument,
} from './events/rider/rider-events.schema'
import {
  UserCreatedEvent,
  UserCreatedEventDocument,
} from './events/user/user-events.schema'

@Injectable()
export class EventService {
  constructor(
    @InjectModel(UserCreatedEvent.name)  private userCreatedModel: Model<UserCreatedEventDocument>,
    @InjectModel(RiderCreatedEvent.name) private riderCreatedModel: Model<RiderCreatedEventDocument>,
    @InjectModel(DeliveryCreatedEvent.name) private deliveryCreatedModel: Model<DeliveryCreatedEventDocument>,
    @InjectModel(DeliveryRiderAcceptedEvent.name) private deliveryConfirmedModel: Model<DeliveryConfirmedEventDocument>,
    @InjectModel(DeliveryCancelledEvent.name) private deliveryCancelledModel: Model<DeliveryCancelledEventDocument>,
    @InjectModel(DeliveryRiderCancelEvent.name) private deliveryRiderCancelledModel: Model<DeliveryRiderCancelledEventDocument>,
    @InjectModel(DeliveryRiderPickupEvent.name) private deliveryPickedUpModel: Model<DeliveryPickedUpEventDocument>,
    @InjectModel(DeliveryRiderDropoffEvent.name) private deliveryDroppedOffModel: Model<DeliveryDroppedOffEventDocument>,
    @InjectModel(DeliveryProblemEvent.name) private deliveryProblemModel: Model<DeliveryProblemEventDocument>,
  ) {}

  async saveUserCreated(event: UserCreatedEvent): Promise<UserCreatedEvent> {
    const newModel = await this.userCreatedModel.create(event)
    return newModel.save()
  }

  async saveDeliveryCreated(event: DeliveryCreatedEvent): Promise<DeliveryCreatedEvent> {
    const newModel = await this.deliveryCreatedModel.create(event)
    return newModel.save()
  }

  async saveDeliveryCancelled(event: DeliveryCancelledEvent): Promise<DeliveryCancelledEvent> {
    const newModel = await this.deliveryCancelledModel.create(event)
    return newModel.save()
  }

  async saveDeliveryRiderCancelled(event: DeliveryRiderCancelEvent): Promise<DeliveryRiderCancelEvent> {
    const newModel = await this.deliveryRiderCancelledModel.create(event)
    return newModel.save()
  }

  async saveDeliveryCornfirmed(event: DeliveryRiderAcceptedEvent): Promise<DeliveryRiderAcceptedEvent> {
    const newModel = await this.deliveryConfirmedModel.create(event)
    return newModel.save()
  }

  async saveDeliveryPickedUp(event: DeliveryRiderPickupEvent): Promise<DeliveryRiderPickupEvent> {
    const newModel = await this.deliveryPickedUpModel.create(event)
    return newModel.save()
  }

  async saveDeliveryDroppedOff(event: DeliveryRiderDropoffEvent): Promise<DeliveryRiderDropoffEvent> {
    const newModel = await this.deliveryDroppedOffModel.create(event)
    return newModel.save()
  }

  async saveDeliveryProblem(event: DeliveryProblemEvent): Promise<DeliveryProblemEvent> {
    const newModel = await this.deliveryProblemModel.create(event)
    return newModel.save()
  }
}
