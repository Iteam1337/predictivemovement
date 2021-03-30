const elasticResponse = {
  body: {
    took: 6,
    timed_out: false,
    _shards: {
      total: 12,
      successful: 12,
      skipped: 0,
      failed: 0,
    },
    hits: {
      total: 2,
      max_score: 0,
      hits: [
        {
          _index: 'pelias',
          _type: '_doc',
          _id: 'lantmateriet:address:0710b7e5-f46c-4fc7-a87a-52b2acff400d',
          _version: 2,
          _score: 0,
          _source: {
            center_point: {
              lon: 11.954098,
              lat: 57.700429,
            },
            parent: {
              country: ['Sweden'],
              country_id: ['85633789'],
              country_a: ['SWE'],
              region: ['Vastra Gotaland'],
              region_id: ['85688411'],
              region_a: ['VG'],
              county: ['Goteborg'],
              county_id: ['1159302989'],
              county_a: [null],
              locality: ['Göteborg'],
              locality_id: ['101752295'],
              locality_a: [null],
              localadmin: ['Nylose'],
              localadmin_id: ['1125287157'],
              localadmin_a: [null],
              neighbourhood: ['Haga'],
              neighbourhood_id: ['85902143'],
              neighbourhood_a: [null],
            },
            name: {
              default: 'Järntorgsgatan 14',
            },
            address_parts: {
              street: 'Järntorgsgatan',
              number: '14',
              zip: '41301',
            },
            source: 'lantmateriet',
            source_id: '0710b7e5-f46c-4fc7-a87a-52b2acff400d',
            layer: 'address',
          },
          highlight: {
            'address_parts.number': [
              '@kibana-highlighted-field@14@/kibana-highlighted-field@',
            ],
            'address_parts.zip': [
              '@kibana-highlighted-field@41301@/kibana-highlighted-field@',
            ],
            'address_parts.street': [
              '@kibana-highlighted-field@Järntorgsgatan@/kibana-highlighted-field@',
            ],
          },
        },
        {
          _index: 'pelias',
          _type: '_doc',
          _id: 'lantmateriet:address:7af21d8d-96d5-4b21-a9ac-e394b8129cde',
          _version: 2,
          _score: 0,
          _source: {
            center_point: {
              lon: 11.954191,
              lat: 57.700582,
            },
            parent: {
              country: ['Sweden'],
              country_id: ['85633789'],
              country_a: ['SWE'],
              region: ['Vastra Gotaland'],
              region_id: ['85688411'],
              region_a: ['VG'],
              county: ['Goteborg'],
              county_id: ['1159302989'],
              county_a: [null],
              locality: ['Göteborg'],
              locality_id: ['101752295'],
              locality_a: [null],
              localadmin: ['Nylose'],
              localadmin_id: ['1125287157'],
              localadmin_a: [null],
              neighbourhood: ['Haga'],
              neighbourhood_id: ['85902143'],
              neighbourhood_a: [null],
            },
            name: {
              default: 'Järntorgsgatan 12',
            },
            address_parts: {
              street: 'Järntorgsgatan',
              number: '12',
              zip: '41301',
            },
            source: 'lantmateriet',
            source_id: '7af21d8d-96d5-4b21-a9ac-e394b8129cde',
            layer: 'address',
          },
          highlight: {
            'address_parts.number': [
              '@kibana-highlighted-field@12@/kibana-highlighted-field@',
            ],
            'address_parts.zip': [
              '@kibana-highlighted-field@41301@/kibana-highlighted-field@',
            ],
            'address_parts.street': [
              '@kibana-highlighted-field@Järntorgsgatan@/kibana-highlighted-field@',
            ],
          },
        },
      ],
    },
  },
}

const regexResult = [
  {
    address: 'JÄRNTORGSG 12-14',
    street: 'JÄRNTORGSG',
    nr: '12-14',
    zipcode: '413 01',
    city: 'Göteborg',
    country: 'Phone',
  },
]

module.exports = { elasticResponse, regexResult }
