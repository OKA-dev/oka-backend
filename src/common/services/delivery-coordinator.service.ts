import { Injectable } from "@nestjs/common";
import { Delivery } from "src/data/deliverydata/delivery.schema";
import { LatLong } from "../models/geojson";
import { PushNotificationService } from "./push-notification.service";
import { PushMessage } from '../models/push-message'
import Localization from "../util/localization";

@Injectable()
export class DeliveryCoordinatorService {

  constructor(
    private notificationService: PushNotificationService,
  ) {}

  async processDeliveryCreated(delivery: Delivery) {
    // find riders, notify them
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
    }
  }


  async processDeliveryDroppedOff(delivery: Delivery) {
    let message = new PushMessage(Localization.strings.delivery.droppedOff.title, null, Localization.strings.delivery.droppedOff.message)
    const userIds = [delivery.sender._id]
    this.notificationService.sendMessage(message, userIds)
  }

  async processDeliveryProblem(delivery: Delivery) {

  }

  private async findNearbyRiders(location: LatLong) {}
}
