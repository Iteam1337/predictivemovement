const onBotStart = (ctx) => {
  const {
    first_name,

    last_name,

    id,
  } = ctx.update.message.from

  ctx.reply(
    `Välkommen ${first_name} ${last_name}! Skriv "/boka" För att skapa en bokning. Ditt id är ${id}`
  )
}

module.exports = { onBotStart }
