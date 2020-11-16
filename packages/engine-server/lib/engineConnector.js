const amqp = require('fluent-amqp')(process.env.AMQP_URL || 'amqp://localhost')
const id62 = require('id62').default // https://www.npmjs.com/package/id62
const { bookingsCache, transportsCache } = require('./cache')

const routingKeys = {
  NEW: 'new',
  REGISTERED: 'registered',
  ASSIGNED: 'assigned',
  DELIVERED: 'delivered',
  DELIVERY_FALIED: 'delivery_failed',
  PICKED_UP: 'picked_up',
  NEW_INSTRUCTIONS: 'new_instructions',
  DELETED: 'deleted',
}

const JUST_DO_IT_MESSAGE = 'JUST DO IT.'

module.exports = (io) => {
  amqp.connect().then((amqpConnection) => amqpConnection.createChannel())

  /////// Listeners

  const bookings = amqp
    .exchange('outgoing_booking_updates', 'topic', {
      durable: true,
    })
    .queue('update_booking_in_admin_ui', {
      durable: true,
    })
    .subscribe({ noAck: true }, [
      routingKeys.NEW,
      routingKeys.ASSIGNED,
      routingKeys.PICKED_UP,
      routingKeys.DELIVERED,
      routingKeys.DELIVERY_FALIED,
    ])
    .map((bookingRes) => {
      const booking = bookingRes.json()

      return {
        ...booking,
        route: JSON.parse(booking.route),
        metadata: JSON.parse(booking.metadata),
        status: bookingRes.fields.routingKey,
      }
    })

  const transports = amqp
    .exchange('outgoing_vehicle_updates', 'topic', {
      durable: true,
    })
    .queue('update_vehicle_in_admin_ui', {
      durable: true,
    })
    .subscribe({ noAck: true }, [routingKeys.NEW, routingKeys.NEW_INSTRUCTIONS])
    .map((transportRes) => {
      const transport = transportRes.json()

      return {
        ...transport,
        current_route: JSON.parse(transport.current_route),
        metadata: JSON.parse(transport.metadata),
      }
    })

  const plan = amqp
    .exchange('outgoing_plan_updates', 'fanout', {
      durable: true,
    })
    .queue('update_plan_in_admin_ui', {
      durable: true,
    })
    .subscribe({ noAck: true })
    .map((msg) => {
      const planFromMsg = msg.json()

      const plan = {
        ...planFromMsg,
        transports: planFromMsg.vehicles.map((route) => ({
          ...route,
          current_route: JSON.parse(route.current_route),
          metadata: JSON.parse(route.metadata),
        })),
      }

      return plan
    })

  amqp
    .exchange('outgoing_booking_updates', 'topic', {
      durable: true,
    })
    .queue('delete_booking_in_admin_ui', {
      durable: true,
    })
    .subscribe({ noAck: true }, [routingKeys.DELETED])
    .map((bookingData) => bookingData.json())
    .each(deleteBooking)

  function deleteBooking(id) {
    bookingsCache.delete(id)
    io.emit('delete-booking', id)
    console.log('deleted')
  }

  const transportLocationUpdates = amqp
    .exchange('incoming_vehicle_updates', 'topic', {
      durable: true,
    })
    .queue('update_location.admin_ui', {
      durable: true,
    })
    .subscribe({ noAck: true }, ['incoming.updated.location'])
    .map((res) => res.json())

  amqp
    .exchange('outgoing_vehicle_updates', 'topic', {
      durable: true,
    })
    .queue('delete_vehicle_in_admin_ui', {
      durable: true,
    })
    .subscribe({ noAck: true }, [routingKeys.DELETED])
    .map((transportData) => transportData.json())
    .each(deleteTransport)

  function deleteTransport(id) {
    transportsCache.delete(id)
    io.emit('delete-transport', id)
  }

  ///////// Publishers

  const createBooking = (booking) => {
    return amqp
      .exchange('incoming_booking_updates', 'topic', {
        durable: true,
      })
      .publish({ ...booking, assigned_to: null }, routingKeys.REGISTERED, {
        persistent: true,
      })
      .then(() =>
        console.log(
          ` [x] Created booking '${JSON.stringify(booking, null, 2)}'`
        )
      )
  }

  const dispatchOffers = () => {
    return amqp
      .queue('dispatch_offers', {
        durable: true,
        arguments: { 'x-dead-letter-exchange': 'engine_DLX' },
      })
      .publish(JUST_DO_IT_MESSAGE)
  }

  const createTransport = (transport) => {
    return amqp
      .exchange('incoming_vehicle_updates', 'topic', { durable: true })
      .publish(
        {
          id: id62(),
          ...transport,
        },
        routingKeys.REGISTERED,
        {
          persistent: true,
        }
      )
  }

  const publishDeleteBooking = (id) => {
    return amqp
      .exchange('incoming_booking_updates', 'topic', {
        durable: true,
      })
      .publish(id, routingKeys.DELETED, {
        persistent: true,
      })
      .then(() => console.log(` [x] Delete booking ${id}`))
  }

  const publishDeleteTransport = (id) => {
    return amqp
      .exchange('incoming_vehicle_updates', 'topic', {
        durable: true,
      })
      .publish(id, routingKeys.DELETED, {
        persistent: true,
      })
      .then(() => console.log(` [x] Delete transport ${id}`))
  }

  const transportNotifications = amqp
    .exchange('outgoing_vehicle_updates', 'topic', {
      durable: true,
    })
    .queue('transport_notifications.admin_ui', {
      durable: true,
    })
    .subscribe({ noAck: true }, [routingKeys.NEW, routingKeys.NEW_INSTRUCTIONS])
    .map((transportRes) => {
      const transport = transportRes.json()

      return {
        ...transport,
        current_route: JSON.parse(transport.current_route),
        metadata: JSON.parse(transport.metadata),
        status: transportRes.fields.routingKey,
      }
    })

  const bookingNotifications = amqp
    .exchange('outgoing_booking_updates', 'topic', {
      durable: true,
    })
    .queue('booking_notifications.admin_ui', {
      durable: true,
    })
    .subscribe({ noAck: true }, [
      routingKeys.NEW,
      routingKeys.PICKED_UP,
      routingKeys.DELIVERED,
      routingKeys.DELIVERY_FALIED,
    ])
    .map((bookingRes) => {
      const booking = bookingRes.json()

      return {
        ...booking,
        route: JSON.parse(booking.route),
        metadata: JSON.parse(booking.metadata),
        status: bookingRes.fields.routingKey,
      }
    })

  return {
    bookings,
    transports,
    plan,
    publishDeleteBooking,
    publishDeleteTransport,
    dispatchOffers,
    createTransport,
    createBooking,
    transportLocationUpdates,
    transportNotifications,
    bookingNotifications,
  }
}
