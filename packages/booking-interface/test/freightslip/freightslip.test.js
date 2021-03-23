const Telegraf = require('telegraf')
const TelegrafTest = require('telegraf-test')
const wizards = require('../../wizards')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const {
  bot: botService,
  text: textService,
  geolocation: geolocationService,
} = require('../../services')
const mocks = require('./mocks')
const utils = require('../../utils')

const port = 3000
const secretPath = 'test'

describe('freightslip upload', () => {
  const askIfSenderOrRecipient = () => {
    test('receives photo and asks if first of two entries is sender or recipient', (done) => {
      botService.getFileLink = jest.fn().mockResolvedValue('test')
      textService.getTextFromPhoto = jest.fn().mockResolvedValue('test')

      utils.scanAddress = jest.fn().mockResolvedValue(mocks.scanResult)

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
  }

  const uploadImage = () => {
    test('asks if parcel has freightslip', (done) => {
      telegrafTest.sendMessageWithText('/start').then((res) => {
        expect(res.data.text).toMatch(/(Har din försändelse en fraktsedel?)/i)
        done()
      })
    })

    test('user says yes, asks user to upload photo', (done) => {
      telegrafTest
        .sendCallbackQueryWithData('freightslip:confirm')
        .then((res) => {
          expect(res.data.text).toMatch(
            /(Ta en bild på fraktsedeln eller addresslappen och skicka den till mig!)/i
          )
          done()
        })
    })
  }

  const bot = new Telegraf('ABCD:1234567890')
  const telegrafTest = new TelegrafTest({
    url: `http://127.0.0.1:${port}/${secretPath}`,
  })

  bot.use(session())
  bot.use(new Stage(wizards).middleware())

  bot.hears(/start/i, (ctx) => ctx.scene.enter('freightslip'))
  telegrafTest.setUser(mocks.testUser)
  bot.startWebhook(`/${secretPath}`, null, port)

  afterAll(() => {
    bot.stop()
  })

  describe('has image', () => {
    describe('text extraction successful', () => {
      uploadImage()
      askIfSenderOrRecipient()

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
        telegrafTest
          .sendCallbackQueryWithData('booking:confirm')
          .then((res) => {
            expect(res.data.text).toMatch(/Har din försändelse en fraktsedel?/)

            done()
          })
      })
    })

    describe('text extraction unsuccessful', () => {
      describe('retries upload with success', () => {
        uploadImage()

        test('receives photo and gets unsuccessful text extract result', (done) => {
          botService.getFileLink = jest.fn().mockResolvedValue(null)
          textService.getTextFromPhoto = jest.fn().mockResolvedValue(null)

          telegrafTest
            .sendMessage({
              text: '/',
              photo: [{}],
            })
            .then((res) => {
              expect(res.data.text).toMatch(/(Vi kunde inte tolka bilden.)/i)
              done()
            })
        })

        test('user selects try again and is sent to upload step', (done) => {
          telegrafTest.sendCallbackQueryWithData('retry_upload').then((res) => {
            expect(res.data.text).toMatch(
              /(Ta en bild på fraktsedeln eller addresslappen och skicka den till mig!)/i
            )
            done()
          })
        })

        askIfSenderOrRecipient()
      })

      describe('enters recipient manually', () => {
        uploadImage()

        test('receives photo and gets unsuccessful text extract result', (done) => {
          botService.getFileLink = jest.fn().mockResolvedValue(null)
          textService.getTextFromPhoto = jest.fn().mockResolvedValue(null)

          telegrafTest
            .sendMessage({
              text: '/',
              photo: [{}],
            })
            .then((res) => {
              expect(res.data.text).toMatch(/(Vi kunde inte tolka bilden.)/i)
              done()
            })
        })

        test('user selects enter manual and is asked to enter recipient manually', (done) => {
          telegrafTest.sendCallbackQueryWithData('enter_manual').then((res) => {
            expect(res.data.text).toMatch(/(Skriv in mottagaradressen)/i)
            done()
          })
        })

        test('user manually enters recipient with successful lookup', (done) => {
          geolocationService.get = jest
            .fn()
            .mockResolvedValueOnce(mocks.recipient)

          telegrafTest
            .sendMessageWithText(mocks.manualRecipientInput)
            .then((res) => {
              expect(res.data.text).toMatch(/(Är detta rätt?)/)
              done()
            })
        })

        test('user confirms lookup result and is sent to sender location step', (done) => {
          telegrafTest
            .sendCallbackQueryWithData('recipient:geolookup:confirm')
            .then((res) => {
              expect(res.data.text).toMatch(
                /(Tack! Vill du skicka din nuvarande position)/i
              )

              done()
            })
        })
      })
    })
  })

  describe('no image', () => {
    describe('unsuccessful recipient geolocation lookup', () => {
      test('asks if parcel has freightslip', (done) => {
        telegrafTest.sendMessageWithText('/start').then((res) => {
          expect(res.data.text).toMatch(/(Har din försändelse en fraktsedel?)/i)
          done()
        })
      })

      test('user says no, asks user to input manually', (done) => {
        telegrafTest
          .sendCallbackQueryWithData('freightslip:decline')
          .then((res) => {
            expect(res.data.text).toMatch(/(Skriv in mottagaradressen)/i)
            done()
          })
      })

      test('user manually enters recipient with unsuccessful lookup', (done) => {
        geolocationService.get = jest.fn().mockResolvedValueOnce(null)

        telegrafTest
          .sendMessageWithText(mocks.manualRecipientInput)
          .then((res) => {
            expect(res.data.text).toMatch(
              /(Vi fick ingen träff på denna adress och detta namn...)/
            )
            done()
          })
      })
    })

    describe('successful recipient geolocation lookup', () => {
      test('asks if parcel has freightslip', (done) => {
        telegrafTest.sendMessageWithText('/start').then((res) => {
          expect(res.data.text).toMatch(/(Har din försändelse en fraktsedel?)/i)
          done()
        })
      })

      test('user says no, asks user to input manually', (done) => {
        telegrafTest
          .sendCallbackQueryWithData('freightslip:decline')
          .then((res) => {
            expect(res.data.text).toMatch(/(Skriv in mottagaradressen)/i)
            done()
          })
      })

      test('user manually enters recipient with successful lookup', (done) => {
        geolocationService.get = jest
          .fn()
          .mockResolvedValueOnce(mocks.recipient)

        telegrafTest
          .sendMessageWithText(mocks.manualRecipientInput)
          .then((res) => {
            expect(res.data.text).toMatch(/(Är detta rätt?)/)
            done()
          })
      })

      test('user confirms lookup result and is sent to sender location step', (done) => {
        telegrafTest
          .sendCallbackQueryWithData('recipient:geolookup:confirm')
          .then((res) => {
            expect(res.data.text).toMatch(
              /(Tack! Vill du skicka din nuvarande position)/i
            )

            done()
          })
      })
    })
  })
})
