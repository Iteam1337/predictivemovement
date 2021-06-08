const amqp = require('fluent-amqp')(process.env.AMQP_URL || 'amqp://localhost')
import EventEmitter from 'events'

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


const emitter = new EventEmitter()

amqp
    .exchange('outgoing_booking_updates', 'topic', {
      durable: true,
    })
    .queue('booking_notifications.api', {
      durable: true,
    })
    .subscribe({ noAck: true })
    .map((res: any) => {
      const json = res.json()
      return [res.fields.routingKey, json]
    })
    .each(([routingKey, msg]: [string, Object]) => {
      emitter.emit(routingKey, msg)
    })

function waitForBookingCreated(bookingId: string): Promise<EngineBooking> {
  return new Promise((resolve, _reject) => {
    function listener(booking: EngineBooking) {
        if (booking.id === bookingId) {
          resolve(booking)
          emitter.removeListener('new', listener)
        }
      }
    emitter.addListener('new', listener)
  })
}

export { publishCreateBooking, waitForBookingCreated }
