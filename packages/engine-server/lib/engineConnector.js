const amqp = require('fluent-amqp')(process.env.AMQP_URL || 'amqp://localhost')
const id62 = require('id62').default // https://www.npmjs.com/package/id62

const routingKeys = {
  NEW: 'new',
  REGISTERED: 'registered',
  ASSIGNED: 'assigned',
  DELIVERED: 'delivered',
  PICKED_UP: 'picked_up',
  NEW_INSTRUCTIONS: 'new_instructions',
  DELETED: 'deleted',
}

const JUST_DO_IT_MESSAGE = 'JUST DO IT.'

// Bind update_booking_in_admin_ui queue to exchanges, this is done here since fluent-amqp doesnt support
// binding to different exchanges.

amqp
  .connect()
  .then((amqpConnection) => amqpConnection.createChannel())
  .then((ch) =>
    ch
      .assertQueue('update_booking_in_admin_ui', {
        durable: false,
      })
      .then(() =>
        ch.assertExchange('outgoing_booking_updates', 'topic', {
          durable: false,
        })
      )
      .then(() =>
        ch.bindQueue('update_booking_in_admin_ui', 'outgoing_booking_updates')
      )
  )

const bookings = amqp
  .exchange('outgoing_booking_updates', 'topic', {
    durable: false,
  })
  .queue('update_booking_in_admin_ui', {
    durable: false,
  })
  /* .subscribe is supposed to default to {noAck: true}, dont know what
   * it means but messages are not acked if i don't specify this
   */
  .subscribe({ noAck: true }, [
    routingKeys.NEW,
    routingKeys.ASSIGNED,
    routingKeys.PICKED_UP,
    routingKeys.DELIVERED,
  ])
  .map((bookings) => {
    return { ...bookings.json(), status: bookings.fields.routingKey }
  })

const vehicles = amqp
  .exchange('outgoing_vehicle_updates', 'topic', {
    durable: false,
  })
  .queue('update_vehicle_in_admin_ui', {
    durable: false,
  })
  .subscribe({ noAck: true }, [routingKeys.NEW, routingKeys.NEW_INSTRUCTIONS])
  .map((vehicles) => {
    return vehicles.json()
  })

const createBooking = (booking) => {
  return amqp
    .exchange('incoming_booking_updates', 'topic', {
      durable: false,
    })
    .publish({ ...booking, assigned_to: null }, routingKeys.REGISTERED)
    .then(() =>
      console.log(` [x] Created booking '${JSON.stringify(booking, null, 2)}'`)
    )
}

const dispatchOffers = () => {
  return amqp
    .queue('dispatch_offers', { durable: false })
    .publish(JUST_DO_IT_MESSAGE)
}

const addVehicle = (vehicle) => {
  return amqp
    .exchange('incoming_vehicle_updates', 'topic', { durable: false })
    .publish(
      {
        id: id62(),
        ...vehicle,
      },
      routingKeys.REGISTERED
    )
}

const plan = amqp
  .exchange('outgoing_plan_updates', 'fanout', {
    durable: false,
  })
  .queue('update_plan_in_admin_ui', {
    durable: false,
  })
  .subscribe({ noAck: true })
  .map((plan) => {
    return plan.json()
  })

const deleteBooking = (id) => {
  return amqp
    .exchange('incoming_booking_updates', 'topic', {
      durable: false,
    })
    .publish(id, routingKeys.DELETED)
    .then(() => console.log(` [x] Delete booking ${id}`))
}

const deleteVehicle = (id) => {
  return amqp
    .exchange('incoming_vehicle_updates', 'topic', {
      durable: false,
    })
    .publish(id, routingKeys.DELETED)
    .then(() => console.log(` [x] Delete vehicle ${id}`))
}

module.exports = {
  addVehicle,
  bookings,
  vehicles,
  createBooking,
  dispatchOffers,
  plan,
  deleteBooking,
  deleteVehicle,
}
