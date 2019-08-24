import sleep from '../sleep'

let timeout: jest.Mock
beforeEach(() => {
  timeout = jest.fn()
  global.setTimeout = timeout
})

it('sleeps as expected', async () => {
  timeout.mockImplementation(callback => callback())

  await sleep()

  expect(timeout).toBeCalledTimes(1)
  expect(timeout).toBeCalledWith(expect.any(Function), 1000)

  await sleep(1337)

  expect(timeout).toBeCalledTimes(2)
  expect(timeout).nthCalledWith(2, expect.any(Function), 1337)
})
