const amqp = require('fluent-amqp')(process.env.AMQP_HOST || 'amqp://localhost')
// const { generate } = require('@iteam1337/engine/simulator/cars')
const id62 = require('id62').default // https://www.npmjs.com/package/id62

const routingKeys = {
  NEW: 'new',
  REGISTERED: 'registered',
  ASSIGNED: 'assigned',
  DELIVERED: 'delivered',
  PICKED_UP: 'picked_up',
  PLANNED: 'plan_updated',
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
        ch.bindQueue(
          'update_booking_in_admin_ui',
          'outgoing_booking_updates',
          routingKeys.ASSIGNED
        )
      )
      .then(() =>
        ch.bindQueue(
          'update_booking_in_admin_ui',
          'incoming_booking_updates',
          routingKeys.PICKED_UP
        )
      )
      .then(() =>
        ch.bindQueue(
          'update_booking_in_admin_ui',
          'incoming_booking_updates',
          routingKeys.DELIVERED
        )
      )
  )

const bookings = amqp
  .queue('update_booking_in_admin_ui', {
    durable: false,
  })
  /* .subscribe is supposed to default to {noAck: true}, dont know what
   * it means but messages are not acked if i don't specify this
   */
  .subscribe({ noAck: true }, [])
  .map((bookings) => {
    return { ...bookings.json(), status: bookings.fields.routingKey }
  })

const cars = amqp
  .exchange('outgoing_vehicle_updates', 'topic', {
    durable: false,
  })
  .queue('update_vehicle_in_admin_ui', {
    durable: false,
  })
  .subscribe({ noAck: true }, [routingKeys.NEW, routingKeys.PLANNED])
  .map((cars) => {
    return cars.json()
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
const createBookingsFromHistory = (total) => {
  return amqp
    .queue('add_nr_of_historical_bookings', { durable: false })
    .publish(total)
}

const resetState = () =>
  amqp
    .queue('clear_engine_state', { durable: false })
    .publish(JUST_DO_IT_MESSAGE)

const plan = amqp
  .exchange('plan', 'fanout', {
    durable: false,
  })
  .queue('planned_vehicles', {
    durable: false,
  })
  .subscribe({ noAck: true })
  .map((plan) => {
    return plan.json()
  })

module.exports = {
  addVehicle,
  bookings,
  cars,
  createBooking,
  dispatchOffers,
  createBookingsFromHistory,
  resetState,
  plan,
}
