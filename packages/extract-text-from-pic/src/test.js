const got = require('got')

async function letsgo() {
  const img = 'https://i.imgur.com/HOUAzGW.jpg'
  const { body: data } = await got(`http://localhost:4000/gettext?url=${url}`)
  const addresses = await got(
    `http://localhost:3000/getAddressFromText?text=${data}`
  )

  console.log(addresses)
}
