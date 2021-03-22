const testUser = {
  id: 1337,
  username: '@testUser1337',
}

const manualRecipientInput = 'Anders Testsson, Testgatan 12, Göteborg'

const recipient = {
  name: 'Test Testsson',
  address: 'Testgatan 12',
  postCode: '123 45',
  city: 'Stockholm',
}

const scanResult = [
  {
    name: 'Lars Larsson',
    address: 'Testvägen 25',
    postCode: '123 45',
    city: 'Göteborg',
  },
  {
    name: 'Maria Mariasson',
    address: 'Testvägen 13',
    postCode: '123 42',
    city: 'Stockholm',
  },
]

module.exports = { recipient, scanResult, testUser, manualRecipientInput }
