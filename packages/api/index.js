const express = require('express')
const app = express()
const port = 3000

app.post('/bookings', (req, res) => {
  res.send('Hello World!')
})

app.post('/user', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
