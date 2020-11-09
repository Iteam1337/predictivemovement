import cache from '../services/cache'
import * as bot from '../services/bot'
import { open, queues, exchanges } from '../adapters/amqp'
import { Replies } from 'amqplib'
import * as helpers from '../helpers'

const { ADD_INSTRUCTIONS_TO_VEHICLE } = queues
const { OUTGOING_VEHICLE_UPDATES } = exchanges

const vehiclePlan = (): Promise<Replies.Consume> =>
  open
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch
        .assertQueue(ADD_INSTRUCTIONS_TO_VEHICLE, {
          durable: true,
        })
        .then(() =>
          ch.assertExchange(OUTGOING_VEHICLE_UPDATES, 'topic', {
            durable: true,
          })
        )
        .then(() =>
          ch.bindQueue(
            ADD_INSTRUCTIONS_TO_VEHICLE,
            OUTGOING_VEHICLE_UPDATES,
            'new_instructions'
          )
        )
        .then(() =>
          ch.consume(ADD_INSTRUCTIONS_TO_VEHICLE, async (msg) => {
            const vehicle = JSON.parse(msg.content.toString())
            const currentVehicle = await cache.getVehicle(vehicle.id)
            console.log('received plan for vehicle: ', vehicle.id)

            const groupedInstructions = helpers.groupDriverInstructions(
              helpers.cleanDriverInstructions(vehicle.activities)
            )

            await cache.setInstructions(vehicle.id, groupedInstructions)
            await cache.addVehicle(vehicle.id, {
              ...currentVehicle,
              ...vehicle,
            })
            if (bot.driverIsLoggedIn(vehicle.id)) {
              bot.handleNextDriverInstruction(
                parseInt(currentVehicle.telegramId)
              )
            }
            return ch.ack(msg)
          })
        )
    )

export default vehiclePlan
