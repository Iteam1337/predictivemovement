const amqp = require('fluent-amqp')(process.env.AMQP_URL || 'amqp://localhost')
import { components } from './__generated__/schema'
import * as Highland from 'highland'

type NewBookingEvent = {
  id: string
  /*
     %{
  assigned_to: nil,
  delivery: %{
    city: "Stockholm",
    lat: 59.318951,
    lon: 18.05167,
    name: "Ringvägen 9, Stockholm",
    street: "Ringvägen 9",
    time_windows: [
      %{
        earliest: "2021-06-14T22:00:00.000Z",
        latest: "2021-06-23T22:00:00.000Z"
      } 
    ]
  },
  events: [%{timestamp: ~U[2021-06-07 09:09:40.052627Z], type: :new}],
  external_id: "POSTNORD nummber",
  id: "pmb-zwq0nmnm",
  metadata: "{\"cargo\":\"not bad stuff\",\"customer\":\"Zalando\",\"fragile\":false,\"recipient\":{\"contact\":\"+46708111111\",\"info\":\"Adam delivers package at this door\",\"name\":\"Adam the receiver\"},\"sender\":{\"contact\":\"+46708101010\",\"info\":\"Adam lives at different door\",\"name\":\"Adam the sender\"}}",
  pickup: %{
    city: "Stockholm",
    lat: 59.270668,
    lon: 18.045423,
    name: "Fågelstavägen 26, Stockholm",
    street: "Fågelstavägen 26",
    time_windows: [
      %{
        earliest: "2021-06-07T22:00:00.000Z",
        latest: "2021-06-09T22:00:00.000Z"
      }
    ]
  },
  requires_transport_id: nil,
  route: "ROUTE BETWEEN PICKUP & DELIVERY",
  size: %{measurements: [18, 18, 18], weight: 1}
}

    */
}

const publishCreateBooking = (booking: components['schemas']['Booking']) => {
  return amqp
    .exchange('incoming_booking_updates', 'topic', {
      durable: true,
    })
    .publish({ ...booking, assigned_to: null }, 'registered', {
      persistent: true,
    })
    .then(() =>
      console.log(` [x] Created booking '${JSON.stringify(booking, null, 2)}'`)
    )
}

const bookingNotificationStream = amqp
  .exchange('outgoing_booking_updates', 'topic', {
    durable: true,
  })
  .queue('booking_notifications.api', {
    durable: true,
  })

const bookingCreatedStream = bookingNotificationStream
  .subscribe({ noAck: true }, ['new'])
  .map((res: any) => res.json())

function waitFirst<T>(
  stream: Highland.Stream<T>,
  predicate: (t: T) => boolean
) {
  return stream.filter(predicate).head()
}

function waitForBookingCreated(bookingId: string): Promise<NewBookingEvent> {
  return waitFirst<NewBookingEvent>(
    bookingCreatedStream,
    ({ id }) => id === bookingId
  )
    .fork()
    .toPromise(Promise)
}

export { publishCreateBooking, waitForBookingCreated }
