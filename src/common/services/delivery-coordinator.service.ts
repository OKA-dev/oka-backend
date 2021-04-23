import { Injectable } from '@nestjs/common'
import { Delivery } from 'src/data/deliverydata/delivery.schema'
import { Point } from '../models/geojson'
import { PushNotificationService } from './push-notification.service'
import { PushMessage } from '../models/push-message'
import Localization from '../util/localization'
import { SmsMessagingService } from './sms-messaging.service'
import { UserDataService } from 'src/data/userdata/user.data.service'
import { User } from 'src/data/userdata/user.schema'

@Injectable()
export class DeliveryCoordinatorService {

  constructor(
    private notificationService: PushNotificationService,
    private smsService: SmsMessagingService,
    private userData: UserDataService,
  ) {}

  async processDeliveryCreated(delivery: Delivery) {
    // find riders, notify them
    // Criteria
    // location within X kilometers
    // location.time within last X minutes
    // roles: rider
    // balance > 0
    // sort by last package delivered desc
    // - create collection {deliveryId, ridersNotified: [ObjectIdOfRider]}
    console.log('**** Aboiut to get riders')
    let riders = await this.findNearbyRiders(delivery.start.location)
    console.log('**** GOT riders: ', riders)
    riders = await this.findBestMatches(riders)
    console.log('**** FILTERED riders: ', riders)

    // TODO: If no riders found, notify customer service
    this.notifyForPickupRequest(riders, delivery)
  }

  async processDeliveryConfirmed(delivery: Delivery) {
    // notify sender and recipient that his delivery is on the way
    let message = new PushMessage(Localization.strings.delivery.confirmed.title, null, Localization.strings.delivery.confirmed.message)
    const userIds = [delivery.sender._id]
    this.notificationService.sendMessage(message, userIds)
  }

  async processDeliveryRiderCancelled(delivery: Delivery) {
    let message = new PushMessage(Localization.strings.delivery.cancelled.title, null, Localization.strings.delivery.cancelled.message)
    const userIds = [delivery.sender._id]
    this.notificationService.sendMessage(message, userIds)
  }

  async processDeliveryCancelled(delivery: Delivery) {
    let message = new PushMessage(Localization.strings.delivery.riderCancelled.title, null, Localization.strings.delivery.riderCancelled.message)
    const riderId = delivery.rider._id
    if (riderId) {
      this.notificationService.sendMessage(message, [riderId])
    }
  }

  async processDeliveryPickedUp(delivery: Delivery) {
    let message = new PushMessage(Localization.strings.delivery.pickedUp.title, null, Localization.strings.delivery.pickedUp.message)
    let recipientId = delivery.recipient._id
    if (recipientId) {
      this.notificationService.sendMessage(message, [recipientId])
    } else {
      // TODO: send SMS to phone number
      this.smsService.sendSMS(delivery.recipient.phone.e164, '')
    }
  }


  async processDeliveryDroppedOff(delivery: Delivery) {
    let message = new PushMessage(Localization.strings.delivery.droppedOff.title, null, Localization.strings.delivery.droppedOff.message)
    const userIds = [delivery.sender._id]
    this.notificationService.sendMessage(message, userIds)
  }

  async processDeliveryProblem(delivery: Delivery) {

  }

  private async findNearbyRiders(location: Point): Promise<User[]> {
    let maxDistance = 20 * 1000 // wthin 10 km
    let lastUpdated = 60 * 60 // in the last 10 mins
    return await this.userData.nearestRiders(location, maxDistance, lastUpdated)
  }

  private async findBestMatches(riders: User[]): Promise<User[]> {
    return riders
  }

  private async notifyForPickupRequest(riders: User[], delivery: Delivery) {
    const message = new PushMessage(Localization.strings.delivery.created.title, 
      null, 
      Localization.strings.delivery.created.message)
    let userIds = riders.map(r => r._id)
    try {
      console.log('about to notify')
      await this.notificationService.sendMessage(message, userIds)
      console.log('notified')
    } catch (error) {
      console.error('caught error: ', error)
    }
  }
}
