import {
  publishCreateBooking,
  waitForBookingCreated
} from './rabbitmqConnector'
import { components } from './__generated__/schema'
import { nanoid } from 'nanoid'

const createBooking = async (booking: components['schemas']['Booking']) => {
  booking.id = nanoid()
  await publishCreateBooking(booking)
  return waitForBookingCreated(booking.id)
}

export { createBooking }



/*

1. Api generates an ID and adds that to payload and sends it to Rabbit
2. Engine will use that ID for spawning a Booking Process [a]
3. pushes a message to Rabbit to booking_updates exchange with key "new"
{
  id: 'pmb-123s',
  delivery: {},
  pickup: {},
  external_id: 'some ID that UI has sent'
}
4. API will filter on booking_updates queue for keys `new` and `error` and id `pmb-123s` [b]
In case of errors in the Engine or the ID not being valid Engine will push the error to booking_updates exchange with key `error` and includes the id `pmb-123s` and error message
5. Return the booking object with a link to it

L8r IT DO the error cases
[a] If there is already something with that ID, fail, or just return the existing object?!
[b] With a timeout, if it times out return the "request ID" to the caller and have them use the same id on any retries (to avoid duplicates)
*/