const getLastFourChars = (str) => str.slice(str.length - 4, str.length)

const cleanDriverInstructions = (arr) => arr.slice(1, -1)

const groupDriverInstructions = (instructions) => {
  const { data } = instructions.reduce(
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

module.exports = {
  getLastFourChars,
  cleanDriverInstructions,
  groupDriverInstructions,
}
