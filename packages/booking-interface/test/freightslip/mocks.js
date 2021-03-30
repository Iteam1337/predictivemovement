const testUser = {
  id: 1337,
  username: '@testUser1337',
}

const manualRecipientInput = 'Anders Mottagaresson, Testgatan 12, Göteborg'
const manualSenderInput = 'Anders AvsändareSson, Testgatan 12, Göteborg'

const person = {
  name: 'Test Testsson',
  address: 'Testgatan 12',
  postCode: '123 45',
  city: 'Stockholm',
}

const scanResult = [
  {
    address: 'JÄRNTORGSG 12-14',
    street: 'JÄRNTORGSG',
    nr: '12-14',
    zipcode: '413 01',
    city: 'Göteborg',
    country: 'Phone',
  },
]

const parsedText =
  'MA I From: Anders Norrback Bornholm HäR age va lorrängsv SE-141-44 HUDDINGE Postnorc Phone: Contact: Anders Norrback Bornholm = Date: 2020-11-10 Sr frers Norrback Bornholm Date: 2020-11-10 Iteam Solutions Johanna MÅNSSON gRAHN JÄRNTORGSG 12-14 SE-413 01 GÖTEBORG Phone: Contact: Iteam Solutions Entry Code: Service Postpaket inrikes " 21 Issuer/Customer No: 12 I 117 100 020 9 Additional 8ervice(s) Shipment-ID: — 48916318778E'

module.exports = {
  person,
  scanResult,
  testUser,
  manualRecipientInput,
  manualSenderInput,
  parsedText,
}
