import cache from '../services/cache'

import { open, queues, exchanges } from '../adapters/amqp'
import { Replies } from 'amqplib'

const { ADD_VEHICLE } = queues
const { OUTGOING_VEHICLE_UPDATES } = exchanges

const vehicles = (): Promise<Replies.Consume> =>
  open
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch
        .assertQueue(ADD_VEHICLE, {
          durable: true,
        })
        .then(() =>
          ch.assertExchange(OUTGOING_VEHICLE_UPDATES, 'topic', {
            durable: true,
          })
        )
        .then(() =>
          ch.bindQueue(
            ADD_VEHICLE,
            OUTGOING_VEHICLE_UPDATES,
            'new'
          )
        )
        .then(() =>
          ch.consume(ADD_VEHICLE, async (msg) => {
            const vehicle = JSON.parse(msg.content.toString())
            const currentVehicle = (await cache.getVehicle(vehicle.id)) || {}
            console.log('received vehicle: ', vehicle)
            const metadata = JSON.parse(vehicle.metadata)
            await cache.addVehicle(vehicle.id, {
              ...currentVehicle,
              ...vehicle,
              metadata
            })
            if(metadata?.driver?.contact) {
                await cache.setVehicleIdByPhoneNumber(metadata.driver.contact, vehicle.id)
            }
            return ch.ack(msg)
          })
        )
    )

export default vehicles
