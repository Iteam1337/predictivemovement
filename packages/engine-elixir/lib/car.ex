# iex> defmodule User do
#   ...>   defstruct name: "John", age: 27
#   ...> end

# const car = new Car(32, { lat: 21312, lon: 321321})

defmodule Car do
  defstruct id: 0,
            position: %{lng: 53, lat: 14},
            heading: %{lng: 54, lat: 14},
            busy: false,
            route: %{}

  #   heading: %{lng, lat}

  def make(id, position, busy) do
    %Car{id: id, position: position, busy: busy}
  end

  def navigateTo(car, heading) do
    route = Osrm.route(car.position, heading) |> Map.put(:started, NaiveDateTime.utc_now())

    car
    |> Map.update!(:heading, fn _ -> heading end)
    |> Map.update!(:route, fn _ -> route end)
  end

  def position(car), do: position(car, NaiveDateTime.utc_now())

  def position(car, time) do
    relative_time = NaiveDateTime.diff(time, car.route.started)
    Interpolate.get_position_from_route(car.route, relative_time)
  end
end

# def navigateTo (car, heading) do

# end
# end

# const osrm = require('../lib/osrm')
# const distance = require('./distance')
# const interpolate = require('./interpolate')
# const EventEmitter = require('events')
# const findZone = require('../lib/zones')

# class Car extends EventEmitter {
#   constructor (id, position, status) {
#     super()
#     this.id = id
#     this.position = position
#     this.history = []
#     this.status = status
#     this.lastPositions = []
#     this.on('error', err => console.error('car error', err))
#   }

#   simulate (heading) {
#     clearInterval(this._interval)
#     if (!heading) return
#     this._interval = setInterval(() => {
#       const newPosition = interpolate.route(heading.route, new Date())
#       if (newPosition) this.updatePosition(newPosition)
#     }, Math.random() * 3000)
#   }

#   navigateTo (position) {
#     // console.log('navigateFromTo', this.position, position)
#     this.heading = position
#     return osrm.route(this.position, this.heading)
#       .then(route => {
#         route.started = new Date()
#         this.heading.route = route
#         this.simulate(this.heading)
#         return this.heading
#       })
#       .catch(console.error)
#   }

#   pickup (trip) {
#     this.busy = true
#     this.history.push({ status: 'pickup', date: new Date(), trip })
#     this.trip = trip
#     trip.car = this
#     trip.pickupDateTime = new Date(Date.now() + trip.estimate.tta * 1000)
#     this.pickupLocation = trip.booking.departure
#     return trip
#   }

#   dropOff () {
#     if (this.trip) {
#       this.busy = false
#       this.trip.dropOffDateTime = new Date()
#       this.trip = null
#     }
#     this.simulate(false)
#     this.emit('dropoff', this)
#   }

#   offer (offer) {
#     // Fake the approval offer
#     return new Promise((resolve, reject) => {
#       setTimeout(_ => {
#         // TODO: send push notfication
#         offer.car = this
#         offer.approved = Math.random() < 0.5 && new Date() || undefined
#         console.log(`Car #${this.id} ${offer.approved ? 'approved' : 'rejected'} the booking `)
#         this.history.push({ status: 'offered', date: new Date(), offer, approved: !!offer.approved })
#         resolve(offer)
#       }, Math.random() * 10000)
#     })
#   }

#   async updatePosition (position, date) {
#     const moved = (distance.haversine(position, this.position) > 2) // meters
#     const bearing = (distance.bearing(position, this.position))
#     this.position = position
#     this.bearing = bearing
#     this.lastPositions.push({ position: position, date: date || Date.now() })
#     this.matchZone()
#     if (moved) {
#       if (this.lastPositions.length > 1 && date) {
#         await this.matchPositionsToMap()
#       }
#       this.emit('moved', this)
#       return this
#     } else {
#       this.emit('stopped', this)
#       if ((distance.haversine(this.heading, this.position) < 50)) {
#         this.dropOff()
#       }
#     }
#   }

#   matchZone () {
#     const newZone = findZone(this.position)
#     if (newZone && this.zone !== newZone[0]) {
#       this.zone = newZone[0]
#       this.emit('zone', this)
#       // console.log(`car #${this.id} logged in to zone #${this.zone}`)
#     }
#   }

#   matchPositionsToMap () {
#     return osrm.match(this.lastPositions.filter(pos => pos.date > Date.now() - 4 * 60 * 1000))
#       .then(match => {
#         //console.log('matched route', ms, 'ms')
#         const matching = match.matchings && match.matchings.length && match.matchings[0]
#         if (!matching) return this
#         const points = interpolate.points(matching)
#         points.reverse().reduce((time, point) => {
#           point.time = time - (point.duration * 1000 || 0) // hack: find purer way later
#           point.speed = !point.meters ? 0 : Math.round(((point.meters) / 1000) / (point.duration / 60 / 60))
#           return point.time
#         }, new Date(this.lastPositions.slice(-1).pop().date).valueOf())

#         this.tail = points.map(point => ([...point.position, point.time, point.speed])).reverse() // reverse back
#         this.speed = points.length ? points[0].speed : 0
#         //this.tail = polyline.decode(matching.geometry)
#         return this
#       })
#       .catch(err => console.error('match', err))
#   }

# }

# module.exports = Car
