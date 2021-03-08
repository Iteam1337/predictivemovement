const Telegraf = require('telegraf')
const TelegrafTest = require('telegraf-test')
const wizards = require('../wizards')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const botService = require('../services/bot')
const textService = require('../services/text')
const utils = require('../utils')

const port = 3000
const secretPath = 'test'

describe('freightslip upload', () => {
  const bot = new Telegraf('ABCD:1234567890')
  const telegrafTest = new TelegrafTest({
    url: `http://127.0.0.1:${port}/${secretPath}`,
  })

  bot.use(session())
  bot.use(new Stage(wizards).middleware())
  bot.hears(/start/i, (ctx) => ctx.scene.enter('freightslip'))
  bot.startWebhook(`/${secretPath}`, null, port)

  telegrafTest.setUser({
    id: 1337,
    username: '@testUser1337',
  })

  afterAll(() => {
    bot.stop()
  })

  test('asks if parcel has freightslip', (done) => {
    telegrafTest.sendMessageWithText('/start').then((res) => {
      expect(res.data.text).toMatch(/(Har din försändelse en fraktsedel?)/i)
      done()
    })
  })

  test('tells user to upload photo', (done) => {
    telegrafTest
      .sendCallbackQueryWithData('freightslip:confirm')
      .then((res) => {
        expect(res.data.text).toMatch(
          /(Ta en bild på fraktsedeln eller addresslappen och skicka den till mig!)/i
        )
        done()
      })
  })

  test('receives photo and asks if first of two entries is sender or recipient', (done) => {
    botService.getFileLink = jest.fn().mockResolvedValue('hej')
    textService.getTextFromPhoto = jest
      .fn()
      .mockResolvedValue(
        'OQ Skicka Hem Betalsätt: NTEANETBETALD Från Köpt: 1-01-15 fatima kebbeh sockerbiten3 231 63 TRELLEBORG Sverige fl? fatima kebbeh el: HH " lzabella Larsson Storhöjdsgatan 9 4186 71 GOTEBORG Sverige PortKod: Tel: 07678650086 " MINAMAAEL ANA TU NI AJ0866916548E PostNord Software V3 Vikt: 0.5 kg '
      )

    utils.scanAddress = jest.fn().mockResolvedValue([
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
    ])

    telegrafTest
      .sendMessage({
        text: '/',
        photo: [{}],
      })
      .then((res) => {
        expect(res.data.text).toMatch(/(Lars Larsson)/i)

        done()
      })
  })

  test('user selects recipient', (done) => {
    telegrafTest
      .sendCallbackQueryWithData('freightslip:is_recipient')
      .then((res) => {
        expect(res.data.text).toMatch(/(Tack!)/i)
        done()
      })
  })
})
