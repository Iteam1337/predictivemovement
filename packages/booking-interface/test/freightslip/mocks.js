const testUser = {
  id: 1337,
  username: '@testUser1337',
}

const recipientGeoLookupResponse = [
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [123, 234] },
    properties: {
      layer: 'address',
      source: 'lantmateriet',
      source_id: '4d0cf16f-9513-4724-a26c-3dde3a747c55',
      name: 'Kaponjärgatan 4B',
      housenumber: '4B',
      street: 'Kaponjärgatan',
      postalcode: '41302',
      confidence: 1,
      match_type: 'exact',
      accuracy: 'point',
      country: 'Sweden',
      country_gid: 'whosonfirst:country:85633789',
      country_a: 'SWE',
      region: 'Vastra Gotaland',
      region_gid: 'whosonfirst:region:85688411',
      region_a: 'VG',
      county: 'Goteborg',
      county_gid: 'whosonfirst:county:1159302989',
      localadmin: 'Nylose',
      localadmin_gid: 'whosonfirst:localadmin:1125287157',
      locality: 'Göteborg',
      locality_gid: 'whosonfirst:locality:101752295',
      neighbourhood: 'Haga',
      neighbourhood_gid: 'whosonfirst:neighbourhood:85902143',
      label: 'Kaponjärgatan 4B, Göteborg, Sweden',
    },
  },
]

const senderGeoLookupResponse = [
  {
    type: 'Feature',
    geometry: { type: 'Point', coordinates: [123, 234] },
    properties: {
      layer: 'address',
      source: 'lantmateriet',
      source_id: '4d0cf16f-9513-4724-a26c-3dde3a747c55',
      name: 'Kaponjärgatan 4B',
      housenumber: '4B',
      street: 'Kaponjärgatan',
      postalcode: '41302',
      confidence: 1,
      match_type: 'exact',
      accuracy: 'point',
      country: 'Sweden',
      country_gid: 'whosonfirst:country:85633789',
      country_a: 'SWE',
      region: 'Vastra Gotaland',
      region_gid: 'whosonfirst:region:85688411',
      region_a: 'VG',
      county: 'Goteborg',
      county_gid: 'whosonfirst:county:1159302989',
      localadmin: 'Nylose',
      localadmin_gid: 'whosonfirst:localadmin:1125287157',
      locality: 'Göteborg',
      locality_gid: 'whosonfirst:locality:101752295',
      neighbourhood: 'Haga',
      neighbourhood_gid: 'whosonfirst:neighbourhood:85902143',
      label: 'Kaponjärgatan 4B, Göteborg, Sweden',
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
  recipientGeoLookupResponse,
  senderGeoLookupResponse,
  scanResult,
  testUser,
  parsedText,
}
