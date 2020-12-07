const _ = require('highland')
const helpers = require('./helpers')
const id62 = require('id62').default // https://www.npmjs.com/package/id62
const { bookingsCache, transportsCache, planCache } = require('./cache')
const parcel = require('./parcel')

module.exports = (io) => {
  const {
    bookings,
    transports,
    plan,
    createTransport,
    createBooking,
    dispatchOffers,
    publishDeleteBooking,
    publishDeleteTransport,
    publishMoveBooking,
    transportEvents,
    transportLocationUpdates,
    transportNotifications,
    bookingNotifications,
    updateBooking,
    updateVehicle,
  } = require('./engineConnector')(io)

  io.on('connection', function (socket) {
    _.merge([_(bookingsCache.values()), bookings.fork()])
      .doto((booking) => bookingsCache.set(booking.id, booking))
      .map((b) => {
        const {
          assigned_to,
          external_id,
          requires_transport_id,
          ...booking
        } = b

        return {
          ...booking,
          assignedTo: assigned_to,
          externalId: external_id,
          requiresTransportId: requires_transport_id,
        }
      })
      .batchWithTimeOrCount(1000, 1000)
      .errors(console.error)
      .each((bookings) => {
        console.log('bookings', JSON.stringify(bookings))
        socket.emit('bookings', bookings)
      })

    _.merge([_(transportsCache.values()), transports.fork()])
      .filter((transport) => transport.id)
      .doto((transport) => {
        transportsCache.set(transport.id, transport)
      })
      .batchWithTimeOrCount(1000, 2000)
      .errors(console.error)
      .each((transports) => socket.emit('transports', transports))

    _.merge([_(planCache.values()), plan.fork()])
      .map(({ excluded_booking_ids, ...plan }) => ({
        ...plan,
        excludedBookingIds: excluded_booking_ids.map((booking) => {
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
      if (!transportsCache.has(id)) return

      const transport = transportsCache.get(id)

      const updatedTransport = {
        ...transport,
        location,
      }

      transportsCache.set(id, updatedTransport)

      return socket.emit('transport-updated', transportLocationUpdate)
    })

    _(bookingNotifications.fork()).each((booking) => {
      socket.emit('notification', helpers.bookingToNotification(booking))
    })

    _(transportEvents.fork()).each(({ id, event }) =>
      socket.emit(
        'notification',
        helpers.transportToNotification({ id }, event)
      )
    )

    _(transportNotifications.fork()).each((transport) => {
      socket.emit('notification', helpers.transportToNotification(transport))
    })

    socket.on('new-booking', (params) => {
      const booking = {
        external_id: params.externalId,
        bookingDate: new Date().toISOString(),
        size: params.size,
        pickup: {
          time_windows: params.pickup.timeWindow,
          lat: params.pickup.lat,
          lon: params.pickup.lon,
          street: params.pickup.street,
          city: params.pickup.city,
        },
        delivery: {
          time_windows: params.delivery.timeWindows,
          lat: params.delivery.lat,
          lon: params.delivery.lon,
          street: params.delivery.street,
          city: params.delivery.city,
        },
        metadata: {
          sender: params.metadata.sender,
          recipient: params.metadata.recipient,
          cargo: params.metadata.cargo,
          fragile: params.metadata.fragile,
        },
      }

      createBooking(booking)
    })

    socket.on('dispatch-offers', () => {
      console.log('received message to dispatch offers, from UI')
      dispatchOffers()
    })

    socket.on('create-transport', (params) => {
      const transport = {
        id: params.id || id62(),
        capacity: params.capacity,
        earliest_start: params.earliestStart,
        latest_end: params.latestEnd,
        start_address: params.startPosition,
        end_address:
          params.endPosition.hasOwnProperty('lon') &&
          params.endPosition.hasOwnProperty('lat')
            ? params.endPosition
            : params.startPosition,

        metadata: {
          driver: {
            name: params.driver.name,
            contact: helpers.changeFormatOnPhoneNumber(params.driver.contact),
          },
          profile: params.metadata.profile,
        },
      }

      createTransport(transport)
    })

    socket.on('move-booking', ({ bookingId, transportId }) => {
      publishMoveBooking(bookingId, transportId)
    })

    socket.on('delete-booking', (id) => {
      console.log('about to delete booking: ', id)
      bookingsCache.delete(id)
      publishDeleteBooking(id)
      socket.emit('delete-booking', id)
    })

    socket.on('delete-transport', (id) => {
      transportsCache.delete(id)
      publishDeleteTransport(id)
      socket.emit('transport-deleted', id)
    })

    socket.on('update-booking', updateBooking)
    socket.on('update-vehicle', updateVehicle)

    socket.on('search-parcel', async (id) => {
      const response = await parcel.search(id)
      const weight = parcel.getWeight(response)
      const measurements = parcel.getMeasurements(response)

      socket.emit('parcel-info', { weight, measurements })
    })
  })
}
