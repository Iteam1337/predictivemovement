const routingKeys = {
  DELETED: 'deleted',
}

module.exports = ({ amqp, io, bookingsCache, vehiclesCache }) => {
  amqp.connect().then((amqpConnection) => amqpConnection.createChannel())
  amqp
    .exchange('outgoing_booking_updates', 'topic', {
      durable: false,
    })
    .queue('delete_booking_in_admin_ui', {
      durable: false,
    })
    .subscribe({ noAck: true }, [routingKeys.DELETED])
    .map((bookingData) => bookingData.json())
    .each(deleteBooking)

  amqp
    .exchange('outgoing_vehicle_updates', 'topic', {
      durable: false,
    })
    .queue('delete_vehicle_in_admin_ui', {
      durable: false,
    })
    .subscribe({ noAck: true }, [routingKeys.DELETED])
    .map((vehicleData) => vehicleData.json())
    .each(deleteVehicle)

  function deleteBooking(id) {
    console.log('deleted')
    bookingsCache.delete(id)
    io.emit('delete-booking', id)
  }

  function deleteVehicle(id) {
    vehiclesCache.delete(id)
    io.emit('delete-vehicle', id)
  }
}
