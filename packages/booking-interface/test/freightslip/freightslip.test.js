const Telegraf = require('telegraf')
const TelegrafTest = require('telegraf-test')
const wizards = require('../../wizards')
const session = require('telegraf/session')
const Stage = require('telegraf/stage')
const {
  bot: botService,
  text: textService,
  geolocation: geolocationService,
  booking: bookingService,
  elastic: elasticService,
} = require('../../services')

const mocks = require('./mocks')
const elasticMocks = require('../elastic/mocks')

const port = 3000
const secretPath = 'test'

describe('freightslip upload', () => {
  const askIfSenderOrRecipient = (telegrafTest) => {
    test('receives photo and asks if first of two entries is sender or recipient', (done) => {
      botService.getFileLink = jest.fn().mockResolvedValue('test')
      textService.getTextFromPhoto = jest
        .fn()
        .mockResolvedValue(mocks.parsedText)

      elasticService.get = jest
        .fn()
        .mockResolvedValue(elasticMocks.elasticResponse)

      telegrafTest
        .sendMessage({
          text: '/',
          photo: [{}],
        })
        .then((res) => {
          expect(res.data.text).toMatch(/(Så här tolkade vi bilden)/i)
          done()
        })
    })
  }

  const uploadImage = (telegrafTest) => {
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

  telegrafTest.setUser(mocks.testUser)
  bot.use(session())
  bot.use(new Stage(wizards).middleware())
  bot.hears(/start/i, (ctx) => ctx.scene.enter('freightslip'))

  beforeEach(() => {
    bot.startWebhook(`/${secretPath}`, null, port)
  })

  afterEach(() => {
    bot.stop()
  })

  describe('has image', () => {
    describe('text extraction successful, location share from device', () => {
      describe('recipient', () => {
        uploadImage(telegrafTest)
        askIfSenderOrRecipient(telegrafTest)

        test('user selects recipient and is prompted to add sender address', (done) => {
          telegrafTest
            .sendCallbackQueryWithData('freightslip:is_recipient')
            .then((res) => {
              expect(res.data.text).toMatch(/(Tack!)/i)
              expect(res.data).toHaveProperty('reply_markup')

              done()
            })
        })

        test('user selects share location from device location and receives a location share confirm button', (done) => {
          telegrafTest
            .sendCallbackQueryWithData('location:from_location')
            .then((res) => {
              expect(res.data.text).toMatch(
                /Klicka på knappen för att dela position./
              )

              done()
            })
        })

        test('user confirms send location and is then asked if wants to add extra info or continue', (done) => {
          bookingService.makeId = jest.fn().mockReturnValue('ASDF')

          telegrafTest
            .sendMessage({ location: { longitude: 123, latitude: 123 } })
            .then((res) => {
              expect(res.data.text).toMatch(/(Då har du fått bokningsnummer:)/i)
              expect(res.data).toHaveProperty('reply_markup')

              done()
            })
        })

        test('user chooses continue and is sent back to first step', (done) => {
          telegrafTest
            .sendCallbackQueryWithData('booking:confirm')
            .then((res) => {
              expect(res.data.text).toMatch(
                /Har din försändelse en fraktsedel?/
              )

              done()
            })
        })
      })

      describe('sender', () => {
        uploadImage(telegrafTest)
        askIfSenderOrRecipient(telegrafTest)

        test('user selects sender and is prompted for recipient address', (done) => {
          telegrafTest
            .sendCallbackQueryWithData('freightslip:is_sender')
            .then((res) => {
              expect(res.data.text).toMatch(/(Skriv in mottagaradressen)/i)

              done()
            })
        })

        test('user enters recipient address with successful geo lookup', (done) => {
          geolocationService.get = jest
            .fn()
            .mockResolvedValueOnce(mocks.geoLookupResponse)

          telegrafTest
            .sendMessageWithText(mocks.manualRecipientInput)
            .then((res) => {
              expect(res.data.text).toMatch(/(Är detta rätt?)/)
              done()
            })
        })

        test('user confirms lookup result and is sent to confirm or add additional info ', (done) => {
          telegrafTest
            .sendCallbackQueryWithData('recipient:geolookup:confirm')
            .then((res) => {
              expect(res.data.text).toMatch(/(Då har du fått bokningsnummer:)/i)
              done()
            })
        })
      })
    })

    describe('text extraction unsuccessful', () => {
      describe('retries upload with success', () => {
        uploadImage(telegrafTest)

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

        askIfSenderOrRecipient(telegrafTest)
      })

      describe('enters recipient manually', () => {
        uploadImage(telegrafTest)

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
            .mockResolvedValueOnce(mocks.geoLookupResponse)

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
          .mockResolvedValueOnce(mocks.geoLookupResponse)

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
  })

  describe('sender location from manual input', () => {
    uploadImage(telegrafTest)
    askIfSenderOrRecipient(telegrafTest)

    test('user selects recipient and is prompted for location', (done) => {
      telegrafTest
        .sendCallbackQueryWithData('freightslip:is_recipient')
        .then((res) => {
          expect(res.data.text).toMatch(/(Tack!)/i)
          expect(res.data).toHaveProperty('reply_markup')

          done()
        })
    })

    test('user selects share location from manual and is prompted for location input', (done) => {
      telegrafTest
        .sendCallbackQueryWithData('location:from_manual')
        .then((res) => {
          expect(res.data.text).toMatch(/(Skriv in avsändaradressen)/i)
          done()
        })
    })

    test('user enters sender input which has successful lookup', (done) => {
      geolocationService.get = jest
        .fn()
        .mockResolvedValueOnce(mocks.geoLookupResponse)

      telegrafTest.sendMessageWithText(mocks.manualSenderInput).then((res) => {
        expect(res.data.text).toMatch(/(Är detta rätt?)/)
        done()
      })
    })
  })
})
