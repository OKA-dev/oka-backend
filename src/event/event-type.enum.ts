export enum EventType {
  UserAccountCreated = 'account.created.user',
  RiderAccountCreated = 'account.created.rider',
  PackageCreated = 'package.created',
  PackagePickup = 'package.pickup',
  PackageDropoff = 'package.dropoff',
  UserProblem = 'issue.user',
  RiderProblem = 'issue.rider',
  Delivery = 'delivery.*',
  DeliveryCreated = 'delivery.created',
  DeliveryCancelled = 'delivery.cancelled',
  DeliveryRiderCancelled = 'delivery.rider.cancelled',
  DeliveryConfirmed = 'delivery.confirmed',
  DeliveryPickedUp = 'delivery.picked-up',
  DeliveryDroppedOff = 'delivery.dropped-off',
  DeliveryProblem = 'delivery.problem',
  DeliveryRiderProblem = 'delivery.rider.problem',
}