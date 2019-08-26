import osrm from '../../adapters/osrm'

jest.mock('../../adapters/osrm')

import * as service from '../osrm'

describe('#nearest', () => {
  test('call the service', async () => {
    ;(osrm.get as jest.Mock).mockResolvedValue({ data: 'some-data' })

    const response = await service.nearest({ lat: 13.37, lon: 42.0 })

    expect(response).toEqual('some-data')

    expect(osrm.get).toBeCalledTimes(1)
    expect(osrm.get).toBeCalledWith('/nearest/v1/driving/42,13.37')
  })
})
