const id62 = require('id62').default // https://www.npmjs.com/package/id62
const _ = require('highland')
const helpers = require('./helpers')
const {
  bookingsCache,
  transportsCache,
  planCache,
  receiptsCache,
} = require('./cache')
const parcel = require('./parcel')
const {
  toIncomingBooking,
  toIncomingTransport,
  toOutgoingBooking,
  toOutgoingTransport,
} = require('./mappings')

const { serviceStatus, getStatus } = require('./serviceStatus')
const { saveSignature, getSignatures } = require('./adapters/minio')

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
    publishUpdateTransport,
    confirmDeliveryReceipt,
    receipts,
    freightslips,
  } = require('./engineConnector')(io)

  require('./receipts')(receipts, (signature) => {
    confirmDeliveryReceipt(signature.bookingId, signature.transportId)
    io.sockets.emit('signatures', [signature])
  })

  io.on('connection', function (socket) {
    _.merge([_(bookingsCache.values()), bookings.fork()])
      .map((newBooking) => {
        const oldBooking = bookingsCache.get(newBooking.id)
        bookingsCache.set(newBooking.id, { ...oldBooking, ...newBooking })
        return { ...newBooking, ...oldBooking }
      })
      .map(toIncomingBooking)
      .batchWithTimeOrCount(1000, 1000)
      .errors(console.error)
      .each((bookings) => {
        socket.emit('bookings', bookings)
      })

    _.merge([_(transportsCache.values()), transports.fork()])
      .map((newTransport) => {
        const oldTransport = transportsCache.get(newTransport.id)
        transportsCache.set(newTransport.id, {
          ...oldTransport,
          ...newTransport,
        })
        return { ...newTransport, ...oldTransport }
      })
      .map(toIncomingTransport)
      .batchWithTimeOrCount(1000, 2000)
      .errors(console.error)
      .each((transports) => socket.emit('transports', transports))

    _.merge([_(planCache.values()), plan.fork()])
      .map(({ excludedBookingIds, ...plan }) => ({
        ...plan,
        excludedBookingIds: excludedBookingIds?.map((booking) => {
          const b = bookingsCache.get(booking.id)
          if (!b) return booking
          return {
            ...booking,
            lat: b.pickup.lat,
            lon: b.pickup.lon,
          }
        }),
      }))
      .map(helpers.addActivityAddressInfo)
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

    socket.on('new-booking', (booking) =>
      createBooking(toOutgoingBooking(booking))
    )

    socket.on('signed-delivery', (receipt) => {
      io.sockets.emit('signatures', [receipt])
      saveSignature(receipt)
      return confirmDeliveryReceipt(receipt.bookingId, receipt.transportId)
    })

    socket.on('dispatch-offers', () => {
      console.log('received message to dispatch offers, from UI')
      dispatchOffers()
    })

    socket.on('create-transport', (transport) =>
      createTransport(
        toOutgoingTransport({ ...transport, id: transport.id || id62() })
      )
    )

    socket.on('move-booking', ({ bookingId, transportId }) => {
      publishMoveBooking(bookingId, transportId)
    })

    socket.on('delete-booking', (id) => {
      bookingsCache.delete(id)
      publishDeleteBooking(id)
      socket.emit('delete-booking', id)
    })

    socket.on('delete-transport', (id) => {
      transportsCache.delete(id)
      publishDeleteTransport(id)
      socket.emit('transport-deleted', id)
    })

    socket.on('update-booking', (updatedBooking) =>
      updateBooking(toOutgoingBooking(updatedBooking))
    )

    socket.on('update-transport', (updatedTransport) =>
      publishUpdateTransport(toOutgoingTransport(updatedTransport))
    )

    socket.on('search-parcel', async (id) => {
      const response = await parcel.search(id)
      const weight = parcel.getWeight(response)
      const measurements = parcel.getMeasurements(response)

      socket.emit('parcel-info', { weight, measurements })
    })

    socket.emit('service-disruption', {
      status: getStatus(),
    })

    getSignatures()
      .fork()
      .toArray((signatures) => socket.emit('signatures', signatures))
  })

  serviceStatus.fork().each((status) => {
    io.sockets.emit('service-disruption', {
      status,
    })
  })
}
