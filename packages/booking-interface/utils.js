const scanAddress = (_text) => [
  { name: 'Lars Larsson', address: 'Testvägen 25', postCode: '123 45' },
  {
    name: 'Maria Mariasson',
    address: 'Testvägen 13',
    postCode: '123 42',
  },
]

const adress = new RegExp(
  /(?<address>(?<street>[A-Za-zåäöÅÄÖéÈ]+)\s+(?<nr>(\d|\d-\d)+))?,?\s+(?<zipcode>([a-zA-Z$]{2}-)?(\d)+\s*\d+),?\s+(?<city>[A-Za-zåäöÅÄÖ]+),?\s?(?<country>[A-Za-zåäöÅÄÖ]+)?/gm
)

const extractAdresses = (str) => adress.exec(str)

module.exports = { scanAddress, extractAdresses, adress }
