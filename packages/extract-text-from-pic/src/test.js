const got = require('got')

// https://i.imgur.com/YruYJw1.jpg //trasig lapp
// https://i.imgur.com/omyVD1n.jpg //hel fin
// https://i.imgur.com/X9y51tr.jpg //rätt dålig bild

async function letsgo() {
  const img = 'https://i.imgur.com/YruYJw1.jpg'

  const { body: text } = await got(`http://localhost:4000/gettext?url=${img}`)

  const {
    body: { text },
  } = await got(`http://localhost:4000/gettext?url=${img}`, {
    responseType: 'json',
  })

  const { body: data } = await got(
    `http://localhost:3000/getAddressFromText?text=${text}`,
    {
      responseType: 'json',
    }
  )

  console.log('abba', data.adress)
}

letsgo()
