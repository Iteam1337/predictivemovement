const amqp = require('fluent-amqp')(process.env.AMQP_URL || 'amqp://localhost')
const id62 = require('id62').default // https://www.npmjs.com/package/id62
const { bookingsCache, transportsCache } = require('./cache')
const { toIncomingPlan } = require('./mappings')

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
  RECEIPT_CONFIRMED: 'receipt_confirmed',
}

const JUST_DO_IT_MESSAGE = 'JUST DO IT.'

module.exports = (io) => {
  amqp.connect().then((amqpConnection) => {
    amqpConnection.setMaxListeners(30)
    return amqpConnection.createChannel()
  })

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
      routingKeys.UPDATED,
      routingKeys.ASSIGNED,
      routingKeys.PICKED_UP,
      routingKeys.DELIVERED,
      routingKeys.DELIVERY_FALIED,
    ])
    .map((bookingRes) => {
      const booking = bookingRes.json()
      return Object.keys(booking).reduce(
        (prev, curr) => {
          switch (curr) {
            case 'route':
            case 'metadata':
              return typeof booking[curr] === 'string'
                ? { ...prev, [curr]: JSON.parse(booking[curr]) }
                : { ...prev, [curr]: booking[curr] }
            default:
              return { ...prev, [curr]: booking[curr] }
          }
        },
        bookingRes.fields.routingKey === routingKeys.UPDATED
          ? {}
          : { status: bookingRes.fields.routingKey }
      )
    })

  const transports = amqp
    .exchange('outgoing_vehicle_updates', 'topic', {
      durable: true,
    })
    .queue('update_vehicle_in_admin_ui', {
      durable: true,
    })
    .subscribe({ noAck: true }, [
      routingKeys.NEW,
      routingKeys.NEW_INSTRUCTIONS,
      routingKeys.UPDATED,
    ])
    .map((transportRes) => {
      const transport = transportRes.json()

      if (transport.current_route)
        transport.currentRoute = JSON.parse(transport.current_route)

      if (typeof transport['metadata'] === 'string')
        transport.metadata = JSON.parse(transport.metadata)

      return {
        ...transport,
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
    .map((msg) => msg.json())
    .map(toIncomingPlan)

  const receipts = amqp
    .exchange('delivery_receipts', 'topic', {
      durable: true,
    })
    .queue('delivery_receipts', {
      durable: true,
    })
    .subscribe({ noAck: true }, 'new')
    .map((msg) => msg.json())

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
  }

  const deleteTransport = (id) => {
    transportsCache.delete(id)
    io.emit('delete-transport', id)
  }

  const updateTransport = (partialTransport) => {
    const transport = transportsCache.get(partialTransport.id)
    const updatedTransport = Object.assign({}, transport, partialTransport)
    transportsCache.set(transport.id, updatedTransport)
    io.emit('transport-updated', updatedTransport)
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

  const freightslips = amqp
    .exchange('freightslips', 'topic', {
      durable: true,
    })
    .queue('freightslip_from_telegram', {
      durable: true,
    })
    .subscribe({ noAck: true }, 'new')
    .map((msg) => msg.content.toString())

  ///////// Publishers

  const confirmDeliveryReceipt = (bookingId, transportId) => {
    return amqp
      .exchange('delivery_receipts', 'topic', {
        durable: true,
      })
      .publish({ transportId, bookingId }, routingKeys.RECEIPT_CONFIRMED, {
        persistent: true,
      })
      .then(() =>
        console.log(` [x] Confirmed receipt for booking: '${bookingId}'`)
      )
  }

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

  const publishMoveBooking = (bookingId, transportId) => {
    return amqp
      .exchange('incoming_booking_updates', 'topic', { durable: true })
      .publish(
        JSON.stringify({ id: bookingId, requires_transport_id: transportId }),
        routingKeys.BOOKING_MOVED,
        {
          persistent: true,
        }
      )
      .then(() =>
        console.log(` Move booking ${bookingId} to transport ${transportId} `)
      )
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

  const transportEvents = amqp
    .exchange('incoming_vehicle_updates', 'topic', { durable: true })
    .queue('transport_notifications.admin_ui', { durable: true })
    .subscribe({ noAck: true }, [
      routingKeys.TRANSPORT.LOGIN,
      routingKeys.TRANSPORT.FINISHED,
    ])
    .map((res) => {
      const { id } = res.json()
      return {
        id,
        event: res.fields.routingKey,
      }
    })

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
        status: bookingRes.fields.routingKey,
      }
    })

  const updateBooking = (booking) => {
    return amqp
      .exchange('incoming_booking_updates', 'topic', {
        durable: true,
      })
      .publish(booking, routingKeys.UPDATED, {
        persistent: true,
      })
      .then(() =>
        console.log(
          ` [x] Updated booking '${JSON.stringify(booking, null, 2)}'`
        )
      )
  }

  const transportUpdates = amqp
    .exchange('outgoing_vehicle_updates', 'topic', {
      durable: true,
    })
    .queue('transport_updated', {
      durable: true,
    })
    .subscribe({ noAck: true }, routingKeys.UPDATED)
    .map((transportRes) => transportRes.json())
    .each(updateTransport)

  const publishUpdateTransport = (transport) => {
    return amqp
      .exchange('incoming_vehicle_updates', 'topic', {
        durable: true,
      })
      .publish(transport, routingKeys.UPDATED, {
        persistent: true,
      })
      .then(() =>
        console.log(
          ` [x] Published update transport '${JSON.stringify(
            transport,
            null,
            2
          )}'`
        )
      )
  }

  return {
    bookings,
    transports,
    plan,
    publishDeleteBooking,
    publishDeleteTransport,
    publishMoveBooking,
    dispatchOffers,
    createTransport,
    createBooking,
    transportEvents,
    transportLocationUpdates,
    transportNotifications,
    bookingNotifications,
    updateBooking,
    publishUpdateTransport,
    transportUpdates,
    confirmDeliveryReceipt,
    receipts,

    freightslips,
  }
}
