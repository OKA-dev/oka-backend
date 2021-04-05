export default class Localization {
  static strings = {
    delivery: {
      confirmed: {
        title: 'Delivery Confirmed',
        message: 'Your rider is on the way to pick up your package. Please ensure the package is properly secured and ready for pickup.',
      },
      cancelled: {
        title: 'Package cancelled',
        message: 'The sender has cancelled this pickup request. Please contact support if you have any questions.',
      },
      riderCancelled: {
        title: 'Rider cancelled package',
        message: 'The rider has cancelled this delivery. Please contact support if you need any assistance.',
      },
      pickedUp: {
        title: 'Package on it\'s way 🛵',
        message: 'A package heading your way has been picked up. Please prepare for delivery.',
      },
      droppedOff: {
        title: 'Package delivered 🎁',
        message: 'Your package has been delivered. Thanks for using Oka!',
      }
    }
  }
}