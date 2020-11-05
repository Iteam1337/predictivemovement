import cache from '../services/cache'
import * as bot from '../services/bot'
import { open, queues, exchanges } from '../adapters/amqp'
import { Replies } from 'amqplib'
import * as helpers from '../helpers'
import { getAddressFromCoordinate } from '../services/pelias'
import { Instruction } from '../types'

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
            console.log('received instructions for vehicle: ', vehicle.id)
            const groupedInstructions = await Promise.all(
              vehicle.activities.map(
                async (instruction: Instruction): Promise<Instruction> => ({
                  ...instruction,
                  address: {
                    ...instruction.address,
                    name: await getAddressFromCoordinate(instruction.address),
                  },
                })
              )
            )
              .then(helpers.cleanDriverInstructions)
              .then(helpers.groupDriverInstructions)
            await cache.setInstructions(vehicle.id, groupedInstructions)
            await cache.addVehicle(vehicle.id, {
              ...currentVehicle,
              ...vehicle,
            })
            if (bot.driverIsLoggedIn(vehicle.id)) {
              await bot.onInstructionsReceived(
                parseInt(currentVehicle.telegramId),
                groupedInstructions
              )
            }
            return ch.ack(msg)
          })
        )
    )

export default vehiclePlan
