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

const formatRegexResult = (res) =>
  res
    .map((res) => res.groups)
    .filter((group) => group.street && group.nr && group.zipcode)
    .map((x) =>
      // do something better here
      Object.assign({}, x, { zipcode: x.zipcode.replace('SE-', '') })
    )

const peliasResToSuggestedRecipient = (r) => ({
  name: r.properties.name,
  street: r.properties.street,
  housenumber: r.properties.housenumber,
  postalcode: r.properties.postalcode,
  locality: r.properties.locality,
  coordinates: {
    lon: r.geometry.coordinates[0],
    lat: r.geometry.coordinates[1],
  },
})

module.exports = {
  scanAddress,
  extractAdresses,
  adress,
  formatRegexResult,
  peliasResToSuggestedRecipient,
}
