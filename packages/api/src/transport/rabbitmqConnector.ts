import {amqp} from '../amqp/connector'
import EventEmitter from 'events'

export interface EngineTransportRequest {
  id: string,
  start_address: {
    lat: number,
    lon: number
  },
  end_address: {
    lat: number,
    lon: number
  },
  metadata: {},
  capacity: {
    weight?: number,
    volume?: number
  },
}

const publishCreateTransport = (transport: EngineTransportRequest) => {
  return amqp
      .exchange('incoming_transport_updates', 'topic', { durable: true })
      .publish(
        {...transport},'registered',
        {
          persistent: true,
        }
      ).then(() =>
      console.log(` [x] Created Transport '${JSON.stringify(transport, null, 2)}'`)
    )
}


const emitter = new EventEmitter()

amqp
    .exchange('outgoing_transport_updates', 'topic', {
      durable: true,
    })
    .queue('transport_notifications.api', {
      durable: true,
    })
    .subscribe({ noAck: true }, '*')
    .map((res: any) => {
      const json = res.json()
      return [res.fields.routingKey, json]
    })
    .each(([routingKey, msg]: [string, Object]) => {
      emitter.emit(routingKey, msg)
    })

function waitForTransportCreated(transportId: string): Promise<EngineTransportRequest> {
  return new Promise((resolve, _reject) => {
    function listener(transport: EngineTransportRequest) {
        if (transport.id === transportId) {
          resolve(transport)
          emitter.removeListener('new', listener)
        }
      }
    emitter.addListener('new', listener)
  })
}

export { publishCreateTransport, waitForTransportCreated }
