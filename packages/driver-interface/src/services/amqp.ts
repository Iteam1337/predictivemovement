import { TelegrafContext } from 'telegraf/typings/context'
import { open, exchanges } from '../adapters/amqp'
import { LocationMessage } from '../types'

export const updateLocation = (
  msg: LocationMessage,
  _ctx: TelegrafContext
): void => {
  open
    .then((conn) => conn.createChannel())
    .then((ch) => {
      ch.assertExchange(exchanges.INCOMING_VEHICLE_UPDATES, 'topic', {
        durable: false,
      }).then(() =>
        ch.publish(
          exchanges.INCOMING_VEHICLE_UPDATES,
          'incoming.updated.location',
          Buffer.from(JSON.stringify(msg))
        )
      )
    })
    .catch(console.warn)
}
