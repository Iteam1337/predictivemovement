const amqp = require('fluent-amqp')(process.env.AMQP_URL || 'amqp://localhost')
import Highland from 'highland'

export interface EngineBookingRequest {
  id: string,
  pickup: {
    lat: number,
    lon: number
  },
  delivery: {
    lat: number,
    lon: number
  },
  metadata: {},
  size: {
    weight?: number,
    measurements?: [number, number, number]
  },
}

export interface EngineBooking extends EngineBookingRequest {
  assigned_to: null
}

const publishCreateBooking = (booking: EngineBookingRequest) => {
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

    amqp
    .exchange('outgoing_booking_updates', 'topic', {
      durable: true,
    })
    .queue('booking_notifications.api', {
      durable: true,
    })
    .subscribe({ noAck: true }, ['new'])
    .map((res: any) => res.json())
    .tap(({ id }: any) => {console.log('\n\n ===> NEW VALUE', id)})
    .each(({ id }: any) => {console.log('\n\n ===> NEW Booking', id)})


function makeBookingNotificationStream() {
  const bookingNotificationStream = amqp
    .exchange('outgoing_booking_updates', 'topic', {
      durable: true,
    })
    .queue('booking_notifications.api', {
      durable: true,
    })

  return bookingNotificationStream
    .subscribe({ noAck: true }, ['new'])
    .map((res: any) => res.json())
    .tap(({ id }: any) => {console.log('\n\n ===> NEW VALUE', id)})
}

function waitFirst<T>(
  stream: Highland.Stream<T>,
  predicate: (t: T) => boolean
) {
  return stream.filter(predicate).head()
}

function waitForBookingCreated(bookingId: string): Promise<EngineBooking> {
  return Promise.resolve({ id: bookingId } as EngineBooking)
  // return waitFirst<EngineBooking>(
  //   makeBookingNotificationStream(),
  //   ({ id }) => id === bookingId
  // )
  //   .toPromise(Promise)
}

export { publishCreateBooking, waitForBookingCreated }
