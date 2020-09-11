const { addVehicle, getVehicle } = require('../services/cache')

const {
  open,
  queues: { SEND_PLAN_TO_VEHICLE },
  exchanges: { OUTGOING_VEHICLE_UPDATES },
} = require('../adapters/amqp')

const vehiclePlan = () => {
  return open
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch
        .assertQueue(SEND_PLAN_TO_VEHICLE, {
          durable: false,
        })
        .then(() =>
          ch.assertExchange(OUTGOING_VEHICLE_UPDATES, 'topic', {
            durable: false,
          })
        )
        .then(() =>
          ch.bindQueue(
            SEND_PLAN_TO_VEHICLE,
            OUTGOING_VEHICLE_UPDATES,
            'plan_updated'
          )
        )
        .then(() =>
          ch.consume(SEND_PLAN_TO_VEHICLE, (msg) => {
            const vehicle = JSON.parse(msg.content.toString())
            const currentVehicle = getVehicle(vehicle.id) || {}
            console.log('received plan')

            addVehicle(vehicle.id, {
              ...currentVehicle,
              ...vehicle,
            })

            return ch.ack(msg)
          })
        )
    )
}

module.exports = vehiclePlan
