const _ = require('highland')
const helpers = require('./helpers')
const id62 = require('id62').default // https://www.npmjs.com/package/id62
const { bookingsCache, vehiclesCache, planCache } = require('./cache')

module.exports = (io) => {
  const {
    bookings,
    vehicles,
    plan,
    addVehicle,
    createBooking,
    dispatchOffers,
    publishDeleteBooking,
    publishDeleteVehicle,
    transportLocationUpdates,
    transportNotifications,
    bookingNotifications,
    updateBooking,
  } = require('./engineConnector')(io)

  io.on('connection', function (socket) {
    _.merge([_(bookingsCache.values()), bookings.fork()])
      .doto((booking) => bookingsCache.set(booking.id, booking))
      .batchWithTimeOrCount(1000, 1000)
      .errors(console.error)
      .each((bookings) => {
        socket.emit('bookings', bookings)
      })

    _.merge([_(vehiclesCache.values()), vehicles.fork()])
      .filter((vehicle) => vehicle.id)
      .doto((vehicle) => {
        vehiclesCache.set(vehicle.id, vehicle)
      })
      .batchWithTimeOrCount(1000, 2000)
      .errors(console.error)
      .each((vehicles) => socket.emit('vehicles', vehicles))

    _.merge([_(planCache.values()), plan.fork()])
      .map((plan) => ({
        ...plan,
        excluded_booking_ids: plan.excluded_booking_ids.map((booking) => {
          const b = bookingsCache.get(booking.id)
          if (!b) return booking
          return {
            ...booking,
            lat: b.pickup.lat,
            lon: b.pickup.lon,
          }
        }),
      }))
      .doto((data) => {
        planCache.set('plan', data)
      })
      .each((data) => socket.emit('plan-update', data))

    _(transportLocationUpdates.fork()).each(({ id, location }) => {
      if (!vehiclesCache.has(id)) return

      const transport = vehiclesCache.get(id)

      const updatedTransport = {
        ...transport,
        location,
      }

      vehiclesCache.set(id, updatedTransport)

      return socket.emit('transport-updated', transportLocationUpdate)
    })

    _(bookingNotifications.fork()).each((booking) => {
      socket.emit('notification', helpers.bookingToNotification(booking))
    })

    _(transportNotifications.fork()).each((transport) => {
      socket.emit('notification', helpers.transportToNotification(transport))
    })

    socket.on('new-booking', (params) => {
      const booking = {
        externalId: params.externalId,
        senderId: 'the-UI', // we can get either some sender id in the message or socket id and then we could emit messages - similar to notifications
        bookingDate: new Date().toISOString(),
        size: params.size,
        pickup: {
          time_windows: params.pickup.timewindow
            ? [params.pickup.timewindow]
            : undefined,
          lat: params.pickup.lat,
          lon: params.pickup.lon,
          street: params.pickup.street,
          city: params.pickup.city,
        },
        delivery: {
          time_windows: params.delivery.timewindow
            ? [params.delivery.timewindow]
            : undefined,
          lat: params.delivery.lat,
          lon: params.delivery.lon,
          street: params.delivery.street,
          city: params.delivery.city,
        },
        metadata: {
          sender: params.sender,
          recipient: params.recipient,
          cargo: params.cargo,
          fragile: params.fragile,
        },
      }

      createBooking(booking)
    })

    socket.on('dispatch-offers', () => {
      console.log('received message to dispatch offers, from UI')
      dispatchOffers()
    })

    socket.on('add-vehicle', (params) => {
      const vehicle = {
        id: params.id || id62(),
        capacity: params.capacity,
        earliest_start: params.timewindow.start,
        latest_end: params.timewindow.end,
        start_address: params.startPosition,
        end_address:
          params.endPosition.hasOwnProperty('lon') &&
          params.endPosition.hasOwnProperty('lat')
            ? params.endPosition
            : params.startPosition,

        metadata: {
          driver: params.driver,
          profile: params.vehicleType,
        },
      }

      addVehicle(vehicle)
    })

    socket.on('delete-booking', (id) => {
      console.log('about to delete booking: ', id)
      bookingsCache.delete(id)
      publishDeleteBooking(id)
      socket.emit('delete-booking', id)
    })

    socket.on('delete-vehicle', (id) => {
      vehiclesCache.delete(id)
      publishDeleteVehicle(id)
      socket.emit('vehicle-deleted', id)
    })

    socket.on('update-booking', (booking) => {
      updateBooking(booking)
    })
  })
}
