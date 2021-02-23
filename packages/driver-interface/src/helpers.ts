import { Instruction } from './types'

export const convertInstructionGroupsToSummaryList = (
  instructionGroups: Instruction[][]
): string =>
  instructionGroups
    .map((instructionGroup: Instruction[]) => {
      const [
        {
          type,
          address: { name },
        },
      ] = instructionGroup
      return {
        name,
        type: type === 'pickupShipment' ? 'Hämta' : 'Lämna',
        ids: instructionGroup
          .map(({ id }) => id)
          .map(formatId)
          .join('__, __'),
      }
    })
    .reduce(
      (summary: string, { ids, name, type }, index) =>
        `${summary}
${index + 1}\. ${type} __${ids}__ vid ${name}`,
      '🎁  Här är dina körningar:'
    )

const getLastFourChars = (str: string): string =>
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
