const client = require('../adapters/elastic')

const buildQuery = (parts, index = 'pelias') => ({
  index,
  body: {
    query: {
      bool: {
        must: [],
        filter: [
          {
            bool: {
              filter: [
                {
                  bool: {
                    should: [
                      {
                        query_string: {
                          fields: ['address_parts.street'],
                          query: `*${parts.street}*`,
                        },
                      },
                    ],
                    minimum_should_match: 1,
                  },
                },
                {
                  bool: {
                    filter: [
                      {
                        bool: {
                          should: [
                            {
                              match: {
                                'address_parts.number': `${parts.nr}`,
                              },
                            },
                          ],
                          minimum_should_match: 1,
                        },
                      },
                      {
                        bool: {
                          should: [
                            {
                              match: {
                                'address_parts.zip': `*${parts.zipcode}*`,
                              },
                            },
                          ],
                          minimum_should_match: 1,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
        should: [],
        must_not: [],
      },
    },
  },
})

const get = (parts) => client.search(buildQuery(parts))

const formatQueryResult = (res) => {
  const [topHit] = res.hits.hits
  return {
    address: topHit._source.address_parts,
    locality: topHit._source.parent.locality[0],
    coordinates: {
      lon: topHit._source.center_point.lon,
      lat: topHit._source.center_point.lat,
    },
  }
}

module.exports = {
  elastic: { get },
  formatQueryResult,
  messaging: require('./messaging'),
  amqp: require('./amqp'),
  bot: require('./bot'),
  text: require('./text'),
  geolocation: require('./geolocation'),
  booking: require('./booking'),
}
