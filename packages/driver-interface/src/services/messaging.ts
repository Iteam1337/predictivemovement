import { TelegrafContext } from 'telegraf/typings/context'
import { Message } from 'telegraf/typings/telegram-types'
import { Markup } from 'telegraf'

import bot from '../adapters/bot'
import * as helpers from '../helpers'
import { Booking, Instruction } from '../types'
import { getDirectionsUrl, getDirectionsFromInstructionGroups } from './google'
import { getAddressFromCoordinate } from './pelias'
import cache from './cache'

const PHONE_GROUPCHAT_ERROR =
  'Bad Request: phone number can be requested in private chats only'

export const onBotStart = (ctx: TelegrafContext): void => {
  ctx.reply(
    "Välkommen till Predictive Movement. När du loggat in kan du agera som förare och hämta och leverera paket i vårt system. Logga in genom att skriva '/login'."
  )
}
export const promptForLogin = (ctx: TelegrafContext): Promise<Message> =>
  ctx.reply('Du är inte inloggad. Logga in först genom att skriva /login')

export const requestPhoneNumber = (ctx: TelegrafContext): Promise<Message> =>
  ctx
    .reply('Klicka på "Skicka telefonnummer" för att logga in', {
      reply_markup: {
        one_time_keyboard: true,
        keyboard: [
          [{ text: '📲 Skicka telefonnummer', request_contact: true }],
        ],
      },
    })
    .catch((e) => {
      console.error(e.description)
      if (e.description === PHONE_GROUPCHAT_ERROR)
        return ctx.reply(
          'Det verkar som att du har lagt till Förarboten i en gruppchatt, detta stöds tyvärr inte. Var vänlig starta en ny chat direkt med Förarboten istället.'
        )
    })

export const onNoVehicleFoundFromId = (
  ctx: TelegrafContext
): Promise<Message> =>
  ctx.reply('Inget fordon med ditt telefonnummer kunde hittas...')

export const sendWelcomeMsg = (telegramId: number): Promise<Message> =>
  bot.telegram.sendMessage(
    telegramId,
    'Välkommen! När du har blivit tilldelad bokningar så kommer du få instruktioner för hur du ska hämta upp dessa.'.concat(
      '\nKlicka på "gemet" nere till vänster om textfältet och välj "location", sedan "live location" för att dela din position. :)'
    )
  )

export const sendSummary = (
  telegramId: number,
  instructionGroups: Instruction[][]
): Promise<Message> => {
  const summaryList = convertInstructionGroupsToSummaryList(instructionGroups)
  const summary =
    summaryList +
    `\n[Se rutt på karta](${getDirectionsFromInstructionGroups(
      instructionGroups
    )})`

  return bot.telegram.sendMessage(telegramId, summary, {
    parse_mode: 'Markdown',
    disable_web_page_preview: true,
  })
}

export const onNoInstructionsForVehicle = (
  ctx: TelegrafContext
): Promise<Message> => ctx.reply('Vi kunde inte hitta några instruktioner...')

export const convertInstructionGroupsToSummaryList = (
  instructionGroups: Instruction[][]
): string =>
  instructionGroups
    .map((instructionGroup: Instruction[]) => {
      const [
        {
          type,
          address: { name },
        },
      ] = instructionGroup
      return {
        name,
        type: type === 'pickupShipment' ? 'Hämta' : 'Lämna',
        ids: instructionGroup
          .map(({ id }) => id)
          .map(helpers.formatId)
          .join('__, __'),
      }
    })
    .reduce(
      (summary: string, { ids, name, type }, index) =>
        `${summary}
${index + 1}\. ${type} __${ids}__ vid ${name}`,
      '🎁  Här är dina körningar:'
    )

export const sendDriverFinishedMessage = (
  telegramId: number
): Promise<Message> =>
  bot.telegram.sendMessage(telegramId, 'Bra jobbat! Tack för idag!')

export const sendPickupInstruction = async (
  instructionGroup: Instruction[],
  telegramId: number,
  bookings: Booking[]
): Promise<Message> => {
  const [firstBooking] = bookings

  const pickup =
    firstBooking.pickup.street && firstBooking.pickup.city
      ? `${firstBooking.pickup.street}, ${firstBooking.pickup.city}`
      : await getAddressFromCoordinate({ ...firstBooking.pickup })

  const delivery =
    firstBooking.delivery.street && firstBooking.delivery.city
      ? `${firstBooking.delivery.street}, ${firstBooking.delivery.city}`
      : await getAddressFromCoordinate({ ...firstBooking.delivery })

  const message = (instructionGroup.length === 1
    ? `🎁 Ditt nästa stopp är [${pickup}](${getDirectionsUrl(
        pickup
      )}) där du ska hämta paket "${helpers.formatId(
        instructionGroup[0].id
      )}". Paketet ska sedan vidare till ${delivery}.`
    : `🎁 Hämta följande paket:
${instructionGroup
  .map((ig, i) => `${++i}. ${helpers.formatId(ig.id)}`)
  .join('\n')}\nvid [${pickup}](${getDirectionsUrl(pickup)})`
  )
    .concat(
      `\n\nDu kan nå avsändaren på telefon: ${firstBooking.metadata.sender.contact}`
    )
    .concat(
      '\nTryck på "[Framme]" när du har kommit till upphämtningsadressen.'
    )

  return bot.telegram.sendMessage(telegramId, message, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Framme',
            callback_data: JSON.stringify({
              e: 'arrived',
            }),
          },
        ],
      ],
    },
    disable_web_page_preview: true,
  })
}

export const sendDeliveryInstruction = async (
  instructionGroup: Instruction[],
  telegramId: number,
  bookings: Booking[]
): Promise<Message> => {
  const [firstBooking] = bookings
  const delivery =
    firstBooking.delivery.street && firstBooking.delivery.city
      ? `${firstBooking.delivery.street}, ${firstBooking.delivery.city}`
      : await getAddressFromCoordinate({ ...firstBooking.delivery })

  const message = (instructionGroup.length === 1
    ? `🎁 Leverera paket "${helpers.formatId(instructionGroup[0].id)}" `
    : `🎁 Leverera följande paket:
  ${instructionGroup
    .map((ig, i) => `${++i}. ${helpers.formatId(ig.id)}`)
    .join('\n')}\n`
  )
    .concat(`till [${delivery}](${getDirectionsUrl(delivery)})!\n`)
    .concat(
      `\nDu kan nå mottagaren på telefon: ${firstBooking.metadata.recipient.contact}`
    )
    .concat('\nTryck "[Framme]" när du har anlänt till upphämtningsplatsen.')
  return bot.telegram.sendMessage(telegramId, message, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Framme',
            callback_data: JSON.stringify({
              e: 'arrived',
            }),
          },
        ],
      ],
    },
    disable_web_page_preview: true,
  })
}

export const sendPickupInformation = (
  instructionGroupId: string,
  telegramId: number,
  bookings: Booking[]
): Promise<Message> => {
  const totalWeight = bookings.reduce(
    (prev, curr) => prev + curr.size.weight || 0,
    0
  )
  const heaviestPackage = Math.max(...bookings.map((b) => b.size.weight || 0))

  const packageInfos = bookings
    .map((b) =>
      `\nID: ${helpers.formatId(b.id)}`
        .concat(b.external_id ? `\nReferensnummer: ${b.external_id}` : '')
        .concat(
          b.metadata.sender?.info
            ? `\nExtra information vid upphämtning: ${b.metadata.sender.info}`
            : ''
        )
        .concat(b.metadata.cargo ? `\nInnehåll: ${b.metadata.cargo}` : '')
        .concat(b.size.weight ? `\nVikt: ${b.size.weight}kg` : '')
        .concat(
          b.size.measurements && b.size.measurements.length === 3
            ? `\nMått: ${b.size.measurements[0]}x${b.size.measurements[1]}x${b.size.measurements[2]}cm`
            : ''
        )
    )
    .join('\n')

  const message = '***Paketinformation***'
    .concat(
      bookings.length > 1
        ? `\nTotal vikt: ${Math.round(totalWeight * 100) / 100}kg`.concat(
            `\nDet tyngsta paketet väger ${heaviestPackage}kg\n`
          )
        : ''
    )

    .concat(packageInfos)
    .concat(
      `\n\nTryck på "[Hämtat]" när du hämtat upp ${
        bookings.length > 1 ? 'paketen' : 'paketet'
      }.`
    )

  return bot.telegram.sendMessage(telegramId, message, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Hämtat',
            callback_data: JSON.stringify({
              e: 'picked_up',
              id: instructionGroupId,
            }),
          },
        ],
      ],
    },
    disable_web_page_preview: true,
  })
}

export const sendDeliveryInformation = (
  instructionGroup: Instruction[],
  instructionGroupId: string,
  telegramId: number,
  bookings: Booking[]
): Promise<Message> => {
  const [firstBooking] = bookings
  return bot.telegram.sendMessage(
    telegramId,
    `Du kan nu nå mottagaren på ${firstBooking.metadata.recipient.contact}`
      .concat(
        firstBooking.metadata.recipient?.info
          ? `\nExtra information vid avlämning: ${firstBooking.metadata.recipient.info}`
          : ''
      )
      .concat(
        `\nTryck "[Kvittera Leverans]" för att påbörja kvittens av ${
          instructionGroup.length > 1 ? 'paketen' : 'paketet'
        }, eller "[Kunde inte leverera]" om du av någon anledning inte kunde leverera ${
          instructionGroup.length > 1 ? 'paketen' : 'paketet'
        }.`
      ),
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Kvittera leverans',
              callback_data: JSON.stringify({
                e: 'begin_delivery_acknowledgement',
                id: instructionGroupId,
              }),
            },
            {
              text: 'Kunde inte leverera',
              callback_data: JSON.stringify({
                e: 'delivery_failed',
                id: instructionGroupId,
              }),
            },
          ],
        ],
      },
      disable_web_page_preview: true,
    }
  )
}

export const sendPhotoReceived = (
  instructionGroupId: string,
  telegramId: number
): Promise<Message> =>
  bot.telegram.sendMessage(
    telegramId,
    `Tack, ditt foto har sparats!\nDu kan ta fler foton om du vill, tryck annars på _Klar_ om du är färdig med kvittensen.`,
    {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Klar',
              callback_data: JSON.stringify({
                e: 'delivered',
                id: instructionGroupId,
              }),
            },
          ],
        ],
      },
    }
  )

export const sendBeginDeliveryAcknowledgement = async (
  telegramId: number
): Promise<Message> => {
  const instructionGroupId = await cache.getCurrentlyDeliveringInstructionGroupId(
    telegramId
  )
  const transportId = await cache.getVehicleIdByTelegramId(telegramId)
  const [instruction] = await cache.getInstructionGroup(instructionGroupId)

  const url = `${
    process.env.ENGINE_UI_URL || 'http://127.0.0.1:3000'
  }/sign-delivery/${transportId}/${instruction.id}`

  return bot.telegram.sendMessage(
    telegramId,
    `
    Följ länken nedan för att signera leveransen.
    Om signeringen ska ske på en annan enhet så kan du kopiera länken till sidan
    där signeringen sker genom att hålla inne [Signera]-knappen och välja "Copy link".`,
    {
      reply_markup: Markup.inlineKeyboard([
        Markup.urlButton('Signera', url),
        Markup.callbackButton(
          'Jag har signerat',
          JSON.stringify({
            e: 'delivered',
            id: instructionGroupId,
          })
        ),
      ]),
    }
  )
}

export const sendCouldNotSavePhoto = async (
  telegramId: number
): Promise<Message> =>
  bot.telegram.sendMessage(telegramId, 'Kunde inte spara bilden på servern.')

export const sendUnhandledError = async (
  telegramId: number
): Promise<Message> =>
  bot.telegram.sendMessage(
    telegramId,
    'Tyvärr gick något fel.. Försök gärna igen efter en stund. Rapportera gärna in felet om det fortfarande inte fungerar.'
  )
