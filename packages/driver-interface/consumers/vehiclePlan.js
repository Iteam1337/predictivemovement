const { addVehicle } = require('../services/cache')

const {
  open,
  queues: { VEHICLE_PLAN },
  exchanges: { OUTGOING_VEHICLE_UPDATES },
} = require('../adapters/amqp')

const vehiclePlan = () => {
  return open
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch
        .assertQueue(VEHICLE_PLAN, {
          durable: false,
        })
        .then(() =>
          ch.assertExchange(OUTGOING_VEHICLE_UPDATES, 'topic', {
            durable: false,
          })
        )
        .then(() => ch.bindQueue(VEHICLE_PLAN, OUTGOING_VEHICLE_UPDATES, 'plan_updated'))
        .then(() =>
          ch.consume(VEHICLE_PLAN, (msg) => {
            const vehicle = JSON.parse(msg.content.toString())
            if (vehicle.metadata && vehicle.metadata.telegram) {
              addVehicle(vehicle.metadata.telegram.senderId, vehicle)
              ch.ack(msg)
            }
          })
        )
    )
}

module.exports = vehiclePlan
