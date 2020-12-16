const helpers = require('../lib/helpers')
const { bookingsCache } = require('../lib/cache')

describe('addActivityAddressInfo', () => {
  it('adds address info to activity', () => {
    const plan = {
      transports: [
        {
          activities: [
            {
              address: {
                city: 'Ljusdal',
                lat: 61.82722667307152,
                lon: 16.072685608984035,
                name: 'Kyrksjön, Ljusdal',
                street: 'Kyrksjön',
              },
              distance: 0,
              duration: 0,
              index: -1,
              type: 'start',
            },
            {
              address: {
                lat: 61.83143997192383,
                lon: 16.02324676513672,
              },
              distance: 7445.1,
              duration: 577.9,
              id: 'pmb-y2m1nwew',
              index: 1,
              type: 'pickupShipment',
            },
            {
              address: {
                lat: 61.83143997192383,
                lon: 16.10633087158203,
              },
              distance: 6030.2,
              duration: 509.7,
              id: 'pmb-y2m1nwew',
              index: 2,
              type: 'deliverShipment',
            },
            {
              address: {
                city: 'Ljusdal',
                lat: 61.82722667307152,
                lon: 16.072685608984035,
                name: 'Kyrksjön, Ljusdal',
                street: 'Kyrksjön',
              },
              distance: 2365,
              duration: 272.8,
              index: -2,
              type: 'end',
            },
          ],
          endAddress: {
            city: 'Ljusdal',
            lat: 61.82722667307152,
            lon: 16.072685608984035,
            name: 'Kyrksjön, Ljusdal',
            street: 'Kyrksjön',
          },
          startAddress: {
            city: 'Ljusdal',
            lat: 61.82722667307152,
            lon: 16.072685608984035,
            name: 'Kyrksjön, Ljusdal',
            street: 'Kyrksjön',
          },
        },
      ],
    }

    bookingsCache.set('pmb-y2m1nwew', {
      pickup: {
        street: 'hejgatan',
        city: 'stockholm',
        lat: 61.83143997192383,
        lon: 16.02324676513672,
      },
      delivery: {
        street: 'hejdagatan',
        city: 'stockholm',
        lat: 61.83143997192383,
        lon: 16.10633087158203,
      },
    })
    const {
      transports: [{ activities }],
    } = helpers.addActivityAddressInfo(plan)
    const addresses = activities.map(({ address }) => address)
    expect(addresses).toEqual([
      {
        city: 'Ljusdal',
        lat: 61.82722667307152,
        lon: 16.072685608984035,
        name: 'Kyrksjön, Ljusdal',
        street: 'Kyrksjön',
      },
      {
        street: 'hejgatan',
        city: 'stockholm',
        lat: 61.83143997192383,
        lon: 16.02324676513672,
      },
      {
        street: 'hejdagatan',
        city: 'stockholm',
        lat: 61.83143997192383,
        lon: 16.10633087158203,
      },
      {
        city: 'Ljusdal',
        lat: 61.82722667307152,
        lon: 16.072685608984035,
        name: 'Kyrksjön, Ljusdal',
        street: 'Kyrksjön',
      },
    ])
  })
})
