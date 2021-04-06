const testUser = {
  id: 1337,
  username: '@testUser1337',
}

const manualRecipientInput = 'Anders Mottagaresson, Testgatan 12, Göteborg'
const manualSenderInput = 'Anders AvsändareSson, Testgatan 12, Göteborg'

const geoLookupResponse = [
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [Array] },
    properties: {
      id: 'node/3976131112',
      gid: 'openstreetmap:venue:node/3976131112',
      layer: 'venue',
      source: 'openstreetmap',
      source_id: 'node/3976131112',
      name: 'OK Älme',
      confidence: 1,
      match_type: 'exact',
      accuracy: 'point',
      country: 'Sweden',
      country_gid: 'whosonfirst:country:85633789',
      country_a: 'SWE',
      region: 'Kronoberg',
      region_gid: 'whosonfirst:region:85688387',
      region_a: 'KR',
      county: 'Almhult',
      county_gid: 'whosonfirst:county:1159303481',
      localadmin: 'Almhult',
      localadmin_gid: 'whosonfirst:localadmin:1125270809',
      label: 'OK Älme, Almhult, Sweden',
      addendum: [Object],
    },
  },
]

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
  geoLookupResponse,
  scanResult,
  testUser,
  manualRecipientInput,
  manualSenderInput,
  parsedText,
}
