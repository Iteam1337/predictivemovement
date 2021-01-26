const amqp = require('fluent-amqp')(process.env.AMQP_URL || 'amqp://localhost')

const routingKeys = {
  TRANSPORT: {
    LOGIN: 'login',
    FINISHED: 'finished',
  },
  NEW: 'new',
  REGISTERED: 'registered',
  ASSIGNED: 'assigned',
  DELIVERED: 'delivered',
  DELIVERY_FALIED: 'delivery_failed',
  PICKED_UP: 'picked_up',
  NEW_INSTRUCTIONS: 'new_instructions',
  DELETED: 'deleted',
  BOOKING_MOVED: 'booking_moved',
  UPDATED: 'updated',
}

const publishDeleteBooking = (bookingId: string) => {
  return amqp
    .exchange('incoming_booking_updates', 'topic', {
      durable: true,
    })
    .publish(bookingId, routingKeys.DELETED, {
      persistent: true,
    })
    .then(() => console.log(`[x] Delete booking ${bookingId}`))
}

export default {
  publishDeleteBooking,
}
