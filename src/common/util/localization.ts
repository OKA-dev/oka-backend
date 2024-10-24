export default class Localization {
  static strings = {
    delivery: {
      created: {
        title: 'Pickup request created!',
        message: 'Great news! A pickup request has been created in your area. Tap to pick up this package.',
      },
      confirmed: {
        title: 'Delivery Confirmed',
        message: 'Your rider is on the way to pick up your package. Please ensure the package is properly secured and ready for pickup.',
      },
      cancelled: {
        title: 'Package cancelled',
        message: 'The sender has cancelled this pickup request.',
      },
      riderCancelled: {
        title: 'Rider cancelled package',
        message: 'The courier has cancelled this delivery. Wait a sec while we find another courier for you.',
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