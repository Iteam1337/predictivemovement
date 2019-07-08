const uuid = require('uuid/v4')

const persons = []

module.exports = app => {
  app.post(
    '/person',
    (
      {
        body: {
          passengers = 1,
          start: { date: startDate, position: startPosition },
          end: { date: endDate, position: endPosition },
        },
      },
      res
    ) => {
      const person = {
        id: uuid(),
        passengers,
        startDate,
        startPosition,
        endDate,
        endPosition,
      }

      console.log(person)

      persons.push(person)

      res.sendStatus(200)
    }
  )

  app.post('/car', (
    {
      body: {
        emptySeats = 4,
        start: { date: startDate, position: startPosition },
        end: { date: endDate, position: endPosition },
      },
    },
    res
  ) => {
    console.log({
      emptySeats,
      startDate,
      startPosition,
      endDate,
      endPosition,
    })
    res.sendStatus(200)
  })
}
