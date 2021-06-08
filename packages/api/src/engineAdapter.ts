import {
  publishCreateBooking,
  waitForBookingCreated,
  EngineBooking
} from './rabbitmqConnector'
import { operations, components } from './__generated__/schema'
import { nanoid } from 'nanoid'

export type CreateBookingInput = operations['create_booking']['requestBody']['content']['application/json']
export type Booking = components['schemas']['Booking']


/*
delivery:
  type: object
  properties:
    address:
      $ref: "#/components/schemas/Address"
    contact:
      $ref: "#/components/schemas/Contact"
pickup:
  type: object
  properties:
    address:
      $ref: "#/components/schemas/Address"
    contact:
      $ref: "#/components/schemas/Contact"
ship_date:
  type: string
  format: date
status:
  type: string
  description: Order Status
  enum:
    - placed
    - approved
    - delivered
size:
  $ref: "#/components/schemas/Size"
*/

function engineBookingToAPI(input: EngineBooking): Booking {
  return {
    id: input.id,
    delivery: {
      address: {
        position: input.delivery
      }
    },
    pickup: {
      address: {
        position: input.pickup
      }
    }
  }
}

const createBooking = async (input: CreateBookingInput): Promise<Booking> => {
  const id = `pmb-${nanoid(8)}`
  await publishCreateBooking({
    id,
    delivery: {
      ...input.delivery.address.position
    },
    pickup: {
      ...input.pickup.address.position
    },
    metadata: {},
    size: {}
  })

  const answer = await waitForBookingCreated(id)
  return engineBookingToAPI(answer)
}

export { createBooking } 