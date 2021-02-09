import { open, queues, exchanges } from '../adapters/amqp'
import { Replies } from 'amqplib'
import * as botServices from '../services/bot'

const { DELIVERY_SIGNATURE_CONFIRMED } = queues
const { DELIVERY_SIGNATURES } = exchanges

const deliverySignatures = (): Promise<Replies.Consume> =>
  open
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch
        .assertQueue(DELIVERY_SIGNATURE_CONFIRMED, {
          durable: true,
        })
        .then(() =>
          ch.assertExchange(DELIVERY_SIGNATURES, 'topic', {
            durable: true,
          })
        )
        .then(() =>
          ch.bindQueue(
            DELIVERY_SIGNATURE_CONFIRMED,
            DELIVERY_SIGNATURES,
            'signature_confirmed'
          )
        )
        .then(() =>
          ch.consume(DELIVERY_SIGNATURE_CONFIRMED, (msg) => {
            const message = JSON.parse(msg.content.toString())

            botServices.handleIncomingSignatureConfirmation(message.transportId)

            return ch.ack(msg)
          })
        )
    )

export default deliverySignatures
