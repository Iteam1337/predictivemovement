const Markup = require('telegraf/markup')
const WizardScene = require('telegraf/scenes/wizard')

const PHONE_GROUPCHAT_ERROR =
  'Bad Request: phone number can be requested in private chats only'

const loginWizard = new WizardScene(
  'login',
  (ctx) => {
    ctx
      .reply('Klicka på "Skicka telefonnummer" för att logga in', {
        reply_markup: Markup.keyboard([
          Markup.contactRequestButton('📲 Skicka telefonnummer'),
        ]).oneTime(),
      })
      .then(() => ctx.wizard.next())
      .catch((e) => {
        console.error(e.description)
        if (e.description === PHONE_GROUPCHAT_ERROR)
          return ctx.reply(
            'Det verkar som att du har lagt till bokningsboten i en gruppchatt, detta stöds tyvärr inte. Var vänlig starta en ny chat direkt med Bokningsboten istället.'
          )
      })
  },
  (ctx) => {
    if (ctx.message.contact && ctx.message.contact.phone_number) {
      // implement login
      return ctx
        .reply(
          `Du är nu inloggad.`.concat(
            `\nNu kan du ta bilder på fraktsedlar och addresslappar för att ladda in dem i systemet.`
          )
        )
        .then(() => ctx.scene.leave())
    }
  }
)

module.exports = loginWizard
