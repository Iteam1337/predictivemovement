const getLastFourChars = (str) => str.slice(str.length - 4, str.length)

const cleanDriverInstructions = (arr) => arr.slice(1, -1)

module.exports = {
  getLastFourChars,
  cleanDriverInstructions,
}
