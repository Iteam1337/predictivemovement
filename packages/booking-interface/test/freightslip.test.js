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

  describe('no image', () => {})

  describe('has image', () => {
    test('asks if parcel has freightslip', (done) => {
      telegrafTest.sendMessageWithText('/start').then((res) => {
        expect(res.data.text).toMatch(/(Har din försändelse en fraktsedel?)/i)
        done()
      })
    })

    test('asks user to upload photo', (done) => {
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
      botService.getFileLink = jest.fn().mockResolvedValue('test')
      textService.getTextFromPhoto = jest.fn().mockResolvedValue('test')

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

    test('user selects recipient and is prompted for location', (done) => {
      telegrafTest
        .sendCallbackQueryWithData('freightslip:is_recipient')
        .then((res) => {
          expect(res.data.text).toMatch(/(Tack!)/i)
          expect(res.data).toHaveProperty('reply_markup')
          expect(res.data.reply_markup.inline_keyboard).toEqual(
            expect.arrayContaining([
              expect.arrayContaining([
                expect.objectContaining({
                  text: 'Ja',
                }),
                expect.objectContaining({
                  text: 'Nej, hämta från fraktsedeln',
                }),
                expect.objectContaining({
                  text: 'Nej, skriv in manuellt',
                }),
              ]),
            ])
          )

          done()
        })
    })

    test('user selects share location and receives a location share confirm button', (done) => {
      telegrafTest
        .sendCallbackQueryWithData('location:from_location')
        .then((res) => {
          expect(res.data.text.keyboard[0][0]).toMatchObject({
            text: /Dela position/,
          })

          done()
        })
    })

    test('user confirms send location and is then asked if wants to add extra info or continue', (done) => {
      telegrafTest
        .sendMessage({ location: { longitude: 123, latitude: 123 } })
        .then((res) => {
          expect(res.data.text).toMatch(/(Då har du fått bokningsnummer:)/i)
          expect(res.data).toHaveProperty('reply_markup')
          expect(res.data.reply_markup.inline_keyboard).toEqual(
            expect.arrayContaining([
              expect.arrayContaining([
                expect.objectContaining({
                  text: 'Fyll i fler detaljer',
                }),
                expect.objectContaining({
                  text: 'Påbörja nästa bokning',
                }),
              ]),
            ])
          )

          done()
        })
    })

    test('user chooses continue and is sent back to first step', (done) => {
      telegrafTest.sendCallbackQueryWithData('booking:confirm').then((res) => {
        expect(res.data.text).toMatch(/Har din försändelse en fraktsedel?/)

        done()
      })
    })
  })
})
