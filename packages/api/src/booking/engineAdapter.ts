import {
  publishCreateBooking,
  waitForBookingCreated,
  EngineBooking
} from './rabbitmqConnector'
import { operations, components } from '../__generated__/schema'
import { nanoid } from 'nanoid'

export type CreateBookingInput = operations['create_booking']['requestBody']['content']['application/json']
export type Booking = components['schemas']['Booking']

function engineBookingToAPI(input: EngineBooking): Booking {
  return {
    id: input.id,
    delivery: {
      address: {
        position: input.delivery,
        city: '',
        street: '',
        name: '',
      }
    },
    pickup: {
      address: {
        position: input.pickup,
        city: '',
        street: '',
        name: '',
      }
    },
    size: input.size && {
      weight: input.size.weight || 0,
      dimensions: {
        length: 0,
        width: 0,
        height: 0,
      },
    },
  }
}

const createBooking = async (input: CreateBookingInput): Promise<Booking> => {
  const id = `pmb-${nanoid(8)}`
  await publishCreateBooking({
    id,
    delivery: {
      ...input.delivery.address.position,
    },
    pickup: {
      ...input.pickup.address.position,
    },
    metadata: {},
    size: {}
  })

  const answer = await waitForBookingCreated(id)
  return engineBookingToAPI(answer)
}



export { createBooking } 