import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { EventType } from './event-type.enum'
import { Event } from './event.schema'
import { EventService } from './event.service'
import { DeliveryCancelledEvent, DeliveryConfirmedEvent, DeliveryCreatedEvent, DeliveryDroppedOffEvent, DeliveryPickedUpEvent, DeliveryProblemEvent } from './events/delivery/delivery-events.schema'
import { UserCreatedEvent } from './events/user/user-events.schema'

@Injectable()
export class GlobalEventListener {
  constructor(private eventService: EventService) {}

  @OnEvent(EventType.UserAccountCreated, { nextTick: true })
  async handleUserCreatedEvent(payload: UserCreatedEvent) {
    console.log('** event listener got payload: ', payload)
    await this.eventService.saveUserCreated(payload)
  }

  @OnEvent(EventType.DeliveryCreated)
  async handleDeliveryCreated(event: DeliveryCreatedEvent) {
    await this.eventService.saveDeliveryCreated(event)
  }

  @OnEvent(EventType.DeliveryCancelled)
  async handleDeliveryCancelled(event: DeliveryCancelledEvent) {
    await this.eventService.saveDeliveryCancelled(event)
  }

  @OnEvent(EventType.DeliveryConfirmed)
  async handleDeliveryConfirmed(event: DeliveryConfirmedEvent) {
    await this.eventService.saveDeliveryCornfirmed(event)
  }

  @OnEvent(EventType.DeliveryPickedUp)
  async handleDeliveryPickedUp(event: DeliveryPickedUpEvent) {
    await this.eventService.saveDeliveryPickedUp(event)
  }

  @OnEvent(EventType.DeliveryDroppedOff)
  async handleDeliveryDroppedOff(event: DeliveryDroppedOffEvent) {
    await this.eventService.saveDeliveryDroppedOff(event)
  }

  @OnEvent(EventType.DeliveryProblem)
  async handleDeliveryProblem(event: DeliveryProblemEvent) {
    await this.eventService.saveDeliveryDroppedOff(event)
  }

}
