import { open, queues, exchanges } from '../adapters/amqp'
import { Replies } from 'amqplib'
import * as botServices from '../services/bot'

const { DELIVERY_RECEIPT_CONFIRMED } = queues
const { DELIVERY_RECEIPTS } = exchanges

const deliverySignatures = (): Promise<Replies.Consume> =>
  open
    .then((conn) => conn.createChannel())
    .then((ch) =>
      ch
        .assertQueue(DELIVERY_RECEIPT_CONFIRMED, {
          durable: true,
        })
        .then(() =>
          ch.assertExchange(DELIVERY_RECEIPTS, 'topic', {
            durable: true,
          })
        )
        .then(() =>
          ch.bindQueue(
            DELIVERY_RECEIPT_CONFIRMED,
            DELIVERY_RECEIPTS,
            'receipt_confirmed'
          )
        )
        .then(() =>
          ch.consume(DELIVERY_RECEIPT_CONFIRMED, (msg) => {
            const message = JSON.parse(msg.content.toString())
            console.log('this is incoming message: ', message)
            botServices.handleIncomingSignatureConfirmation(message.transportId)

            return ch.ack(msg)
          })
        )
    )

export default deliverySignatures
