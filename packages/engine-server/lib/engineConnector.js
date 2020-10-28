const amqp = require('fluent-amqp')(process.env.AMQP_URL || 'amqp://localhost')
const id62 = require('id62').default // https://www.npmjs.com/package/id62
const { bookingsCache, vehiclesCache } = require('./cache')

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
      booking.route = JSON.parse(booking.route)
      booking.metadata = JSON.parse(booking.metadata)

      return { ...booking, status: bookingRes.fields.routingKey }
    })

  const vehicles = amqp
    .exchange('outgoing_vehicle_updates', 'topic', {
      durable: true,
    })
    .queue('update_vehicle_in_admin_ui', {
      durable: true,
    })
    .subscribe({ noAck: true }, [routingKeys.NEW, routingKeys.NEW_INSTRUCTIONS])
    .map((vehicleRes) => {
      const vehicle = vehicleRes.json()
      vehicle.current_route = JSON.parse(vehicle.current_route)
      vehicle.metadata = JSON.parse(vehicle.metadata)

      return vehicle
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
        vehicles: planFromMsg.vehicles.map((route) => ({
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
    .map((vehicleData) => vehicleData.json())
    .each(deleteVehicle)

  function deleteVehicle(id) {
    vehiclesCache.delete(id)
    io.emit('delete-vehicle', id)
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

  const addVehicle = (vehicle) => {
    return amqp
      .exchange('incoming_vehicle_updates', 'topic', { durable: true })
      .publish(
        {
          id: id62(),
          ...vehicle,
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

  const publishDeleteVehicle = (id) => {
    return amqp
      .exchange('incoming_vehicle_updates', 'topic', {
        durable: true,
      })
      .publish(id, routingKeys.DELETED, {
        persistent: true,
      })
      .then(() => console.log(` [x] Delete vehicle ${id}`))
  }

  const transportNotifications = amqp
    .exchange('outgoing_vehicle_updates', 'topic', {
      durable: true,
    })
    .queue('transport_notifications.admin_ui', {
      durable: true,
    })
    .subscribe({ noAck: true }, [routingKeys.NEW])
    .map((vehicleRes) => {
      const vehicle = vehicleRes.json()
      vehicle.current_route = JSON.parse(vehicle.current_route)
      vehicle.metadata = JSON.parse(vehicle.metadata)

      return vehicle
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
      booking.route = JSON.parse(booking.route)
      booking.metadata = JSON.parse(booking.metadata)

      return { ...booking, status: bookingRes.fields.routingKey }
    })

  return {
    bookings,
    vehicles,
    plan,
    publishDeleteBooking,
    publishDeleteVehicle,
    dispatchOffers,
    addVehicle,
    createBooking,
    transportLocationUpdates,
    transportNotifications,
    bookingNotifications,
  }
}
