import {
  EngineTransportRequest,
  publishCreateTransport,
  waitForTransportCreated,
} from './rabbitmqConnector'
import { operations, components } from '../__generated__/schema'
import { nanoid } from 'nanoid'

export type CreateTransportInput = operations['create_transport']['requestBody']['content']['application/json']
export type Transport = components['schemas']['Transport']

function engineTransportToAPI(input: EngineTransportRequest): Transport {
  return {
    id: input.id,
      start_address: {
        position: input.start_address,
        city: '',
        street: '',
        name: '',
      },
      end_address: {
        position: input.end_address,
        city: '',
        street: '',
        name: '',
      },
      capacity: input.capacity && {
      weight: input.capacity.weight || 0,
      volume: input.capacity.volume || 0
    },
  }
}

const createTransport = async (input: CreateTransportInput): Promise<Transport> => {
  const id = `pmv-${nanoid(8)}`
  await publishCreateTransport({
    id,
    start_address: {
      ...input.start_address.position,
    },
    end_address: {
      ...input.end_address.position,
    },
    metadata: {},
    capacity: {}
  })

  const answer = await waitForTransportCreated(id)
  return engineTransportToAPI(answer)
}

export { createTransport } 