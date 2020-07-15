const amqp = require('fluent-amqp')(process.env.AMQP_HOST || 'amqp://localhost')
// const { generate } = require('@iteam1337/engine/simulator/cars')
const id62 = require('id62').default // https://www.npmjs.com/package/id62

const routingKeys = {
  NEW: 'new',
  ASSIGNED: 'assigned',
  DELIVERED: 'delivered',
  PLANNED: 'plan_updated',
}

const JUST_DO_IT_MESSAGE = 'JUST DO IT.'

const bookings = amqp
  .exchange('bookings', 'topic', {
    durable: false,
  })
  .queue('bookings_to_map', {
    durable: false,
  })
  /* .subscribe is supposed to default to {noAck: true}, dont know what
   * it means but messages are not acked if i don't specify this
   */
  .subscribe({ noAck: true }, [routingKeys.ASSIGNED, routingKeys.DELIVERED])
  .map((bookings) => {
    return { ...bookings.json(), status: bookings.fields.routingKey }
  })

const bookingsNewWithRoutes = amqp
  .exchange('bookings_with_routes', 'topic', {
    durable: false,
  })
  .queue('bookings_to_map', {
    durable: false,
  })
  .subscribe({ noAck: true }, [routingKeys.NEW])
  .map((bookings) => {
    return { ...bookings.json(), status: bookings.fields.routingKey }
  })

const cars = amqp
  .exchange('vehicles', 'topic', {
    durable: false,
  })
  .queue('cars_to_map', {
    durable: false,
  })
  .subscribe({ noAck: true }, [routingKeys.NEW, routingKeys.PLANNED])
  .map((cars) => {
    return cars.json()
  })

const createBooking = (booking) => {
  return amqp
    .exchange('bookings', 'topic', {
      durable: false,
    })
    .publish({ ...booking, assigned_to: null }, routingKeys.NEW)
    .then(() =>
      console.log(` [x] Created booking '${JSON.stringify(booking, null, 2)}'`)
    )
}

const dispatchOffers = () => {
  return amqp
    .queue('dispatch_offers', { durable: false })
    .publish(JUST_DO_IT_MESSAGE)
}

const addVehicle = (position) => {
  return amqp.exchange('cars', 'fanout', { durable: false }).publish({
    id: id62(),
    position,
  })
}

const createBookingsFromHistory = (total) => {
  return amqp.queue('historical_bookings', { durable: false }).publish(total)
}

const resetState = () =>
  amqp.queue('clear_state', { durable: false }).publish(JUST_DO_IT_MESSAGE)

module.exports = {
  addVehicle,
  bookings,
  bookingsNewWithRoutes,
  cars,
  createBooking,
  dispatchOffers,
  createBookingsFromHistory,
  resetState,
}
