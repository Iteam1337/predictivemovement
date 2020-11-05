import { Instruction } from './types'

export const getLastFourChars = (str: string): string =>
  str.slice(str.length - 4, str.length)

export const formatId = (id: string): string =>
  getLastFourChars(id).toUpperCase()

export const cleanDriverInstructions = (
  instructions: Instruction[]
): Instruction[] => instructions.slice(1, -1)

export const groupDriverInstructions = (
  instructions: Instruction[]
): Instruction[][] => {
  const { data } = instructions.reduce<{
    type: string
    address: string
    data: Instruction[][]
  }>(
    (prev, curr) => {
      const currAddress = JSON.stringify(curr.address)
      if (prev.type === curr.type && prev.address === currAddress) {
        const [last] = prev.data.slice(0).reverse()

        return {
          ...prev,
          data: [...prev.data.slice(0, -1), [...last, curr]],
        }
      }

      return {
        type: curr.type,
        address: currAddress,
        data: [...prev.data, [curr]],
      }
    },
    { type: '', address: '', data: [] }
  )

  return data
}
