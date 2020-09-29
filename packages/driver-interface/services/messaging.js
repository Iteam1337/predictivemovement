const bot = require('../adapters/bot')
const helpers = require('../helpers')
const { getDirectionsFromActivities, getDirectionsUrl } = require('./google')
const { getAddressFromCoordinate } = require('./pelias')

const onBotStart = (ctx) => {
  ctx.reply(
    "Välkommen till Predictive Movement. När du loggat in kan du agera som förare och hämta och leverera paket i vårt system. Logga in genom att skriva '/login'."
  )
}

const onPromptUserForTransportId = (ctx) => ctx.reply('Ange ditt transport-id')

const onNoVehicleFoundFromId = (ctx) =>
  ctx.reply('Inget fordon som matchar ditt angivna ID kunde hittas...')

const onDriverLoginSuccessful = (ctx) =>
  ctx.reply(
    'Tack! Du kommer nu få instruktioner för hur du ska hämta upp de bokningar som du har tilldelats.'
  )

const onNoInstructionsForVehicle = (ctx) =>
  ctx.reply('Vi kunde inte hitta några instruktioner...')

const onInstructionsForVehicle = (activities, bookingIds, id) => {
  const directions = getDirectionsFromActivities(activities)

  return bot.telegram.sendMessage(
    id,
    `${bookingIds.length} paket finns att hämta. [Se på kartan](${directions}).`,
    { parse_mode: 'markdown' }
  )
}

const sendDriverFinishedMessage = (telegramId) =>
  bot.telegram.sendMessage(telegramId, 'Bra jobbat! Tack för idag!')

const sendPickupInstruction = async (instruction, telegramId, booking) => {
  const pickup =
    booking.pickup.street && booking.pickup.city
      ? `${booking.pickup.street}, ${booking.pickup.city}`
      : await getAddressFromCoordinate({ ...booking.pickup })

  const delivery =
    booking.delivery.street && booking.delivery.city
      ? `${booking.delivery.street}, ${booking.delivery.city}`
      : await getAddressFromCoordinate({ ...booking.delivery })

  return bot.telegram.sendMessage(
    telegramId,
    `🎁 Hämta paket "${helpers.getLastFourChars(
      instruction.id
    )}" vid [${pickup}](${getDirectionsUrl(
      pickup
    )}) och leverera det sedan till ${delivery}!`.concat(
      `\nTryck på "[Framme]" när du har anlänt till destinationen.`
    ),
    {
      parse_mode: 'markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Framme',
              callback_data: JSON.stringify({
                e: 'arrived',
                id: instruction.id,
              }),
            },
          ],
        ],
      },
      disable_web_page_preview: true,
    }
  )
}

const sendDeliveryInstruction = async (instruction, telegramId, booking) => {
  const delivery =
    booking.delivery.street && booking.delivery.city
      ? `${booking.delivery.street}, ${booking.delivery.city}`
      : await getAddressFromCoordinate({ ...booking.delivery })

  return bot.telegram.sendMessage(
    telegramId,
    `🎁 Leverera paket "${helpers.getLastFourChars(
      instruction.id
    )}" till [${delivery}](${getDirectionsUrl(delivery)})!`.concat(
      `\nTryck "[Framme]" när du har anlänt till destinationen.`
    ),
    {
      parse_mode: 'markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Framme',
              callback_data: JSON.stringify({
                e: 'arrived',
                id: instruction.id,
              }),
            },
          ],
        ],
      },
      disable_web_page_preview: true,
    }
  )
}

const sendPickupInformation = (instruction, telegramId, booking) =>
  bot.telegram.sendMessage(
    telegramId,
    ` ${
      booking.metadata &&
      booking.metadata.sender &&
      booking.metadata.sender.contact
        ? '\nDu kan nu nå avsändaren på ' + booking.metadata.sender.contact
        : ''
    }`
      .concat(
        booking.metadata &&
          booking.metadata.sender &&
          booking.metadata.sender.doorCode
          ? `\nPortkod: ${booking.metadata.sender.doorCode}`
          : ''
      )
      .concat('\n\n***Paketinformation***')
      .concat(`\nÖmtåligt: ${booking.metadata.fragile ? 'Ja' : 'Nej'}`)
      .concat(booking.size.weight ? `\nVikt: ${booking.size.weight}kg` : '')
      .concat(
        booking.size.measurement && booking.size.measurement.length === 3
          ? `\nMått: ${booking.size.measurement[0]}x${booking.size.measurement[1]}x${booking.size.measurement[2]}cm`
          : ''
      )
      .concat(`\nTryck på "[Hämtat]" när du hämtat upp paketet.`),
    {
      parse_mode: 'markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Hämtat',
              callback_data: JSON.stringify({
                e: 'picked_up',
                id: instruction.id,
              }),
            },
          ],
        ],
      },
      disable_web_page_preview: true,
    }
  )

const sendDeliveryInformation = (instruction, telegramId, booking) =>
  bot.telegram.sendMessage(
    telegramId,
    ` ${
      booking.metadata &&
      booking.metadata.recipient &&
      booking.metadata.recipient.contact
        ? 'Du kan nu nå mottagaren på ' + booking.metadata.recipient.contact
        : ''
    }`
      .concat(
        booking.metadata &&
          booking.metadata.recipient &&
          booking.metadata.recipient.doorCode
          ? `\nPortkod: ${booking.metadata.recipient.doorCode}`
          : ''
      )
      .concat(`\nTryck "[Levererat]" när du har lämnat paketet.`),
    {
      parse_mode: 'markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Levererat',
              callback_data: JSON.stringify({
                e: 'delivered',
                id: instruction.id,
              }),
            },
          ],
        ],
      },
      disable_web_page_preview: true,
    }
  )

module.exports = {
  onNoInstructionsForVehicle,
  onInstructionsForVehicle,
  onBotStart,
  sendPickupInstruction,
  sendPickupInformation,
  sendDeliveryInstruction,
  sendDeliveryInformation,
  sendDriverFinishedMessage,
  onNoVehicleFoundFromId,
  onDriverLoginSuccessful,
  onPromptUserForTransportId,
}
