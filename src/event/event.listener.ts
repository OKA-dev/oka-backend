import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { DeliveryCoordinatorService } from 'src/common/services/delivery-coordinator.service'
import { EventType } from './event-type.enum'
import { EventService } from './event.service'
import { DeliveryCancelledEvent, DeliveryRiderAcceptedEvent, DeliveryCreatedEvent, DeliveryRiderDropoffEvent, DeliveryRiderPickupEvent, DeliveryProblemEvent, DeliveryRiderCancelEvent } from './events/delivery/delivery-events.schema'
import { UserCreatedEvent } from './events/user/user-events.schema'

@Injectable()
export class GlobalEventListener {
  constructor(
    private eventService: EventService,
    private deliveryCoordinator: DeliveryCoordinatorService,
    ) {}

  @OnEvent('**', {nextTick: true})
  async handleAll(event: any) {
    console.log('*** Global event handler got payload: ', event)
  }

  @OnEvent(EventType.UserAccountCreated, { nextTick: true })
  async handleUserCreatedEvent(payload: UserCreatedEvent) {
    console.log('** event listener got payload: ', payload)
    await this.eventService.saveUserCreated(payload)
  }

  @OnEvent(EventType.DeliveryCreated, { nextTick: true })
  async handleDeliveryCreated(event: DeliveryCreatedEvent) {
    const createdEvent = await this.eventService.saveDeliveryCreated(event)
    await this.deliveryCoordinator.processDeliveryCreated(event.delivery)
    console.log('finished handling')
  }

  @OnEvent(EventType.DeliveryCancelled)
  async handleDeliveryCancelled(event: DeliveryCancelledEvent) {
    await this.eventService.saveDeliveryCancelled(event)
    await this.deliveryCoordinator.processDeliveryCancelled(event.delivery)
  }

  @OnEvent(EventType.DeliveryRiderCancelled)
  async handleDeliveryCancelledByRider(event: DeliveryRiderCancelEvent) {
    await this.eventService.saveDeliveryCancelled(event)
    await this.deliveryCoordinator.processDeliveryRiderCancelled(event.delivery)
  }

  @OnEvent(EventType.DeliveryRiderAccepted)
  async handleDeliveryConfirmed(event: DeliveryRiderAcceptedEvent) {
    await this.eventService.saveDeliveryCornfirmed(event)
    await this.deliveryCoordinator.processDeliveryConfirmed(event.delivery)
  }

  @OnEvent(EventType.DeliveryRiderPickup)
  async handleDeliveryPickedUp(event: DeliveryRiderPickupEvent) {
    await this.eventService.saveDeliveryPickedUp(event)
    await this.deliveryCoordinator.processDeliveryPickedUp(event.delivery)
  }

  @OnEvent(EventType.DeliveryRiderDropOff)
  async handleDeliveryDroppedOff(event: DeliveryRiderDropoffEvent) {
    await this.eventService.saveDeliveryDroppedOff(event)
    await this.deliveryCoordinator.processDeliveryDroppedOff(event.delivery)

  }

  @OnEvent(EventType.DeliveryProblem)
  async handleDeliveryProblem(event: DeliveryProblemEvent) {
    await this.eventService.saveDeliveryProblem(event)
  }

}
