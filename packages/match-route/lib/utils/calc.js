const toRad = val => (val * Math.PI) / 180

const toDeg = val => val * (180 / Math.PI)

const middlePoint = (point1, point2) => {
  const diffLon = toRad(point2.lon - point1.lon)

  const lat1 = toRad(point1.lat)
  const lat2 = toRad(point2.lat)
  const lon1 = toRad(point1.lon)

  const bX = Math.cos(lat2) * Math.cos(diffLon)
  const bY = Math.cos(lat2) * Math.sin(diffLon)
  const lat3 = Math.atan2(
    Math.sin(lat1) + Math.sin(lat2),
    Math.sqrt((Math.cos(lat1) + bX) * (Math.cos(lat1) + bX) + bY * bY)
  )
  const lon3 = lon1 + Math.atan2(bY, Math.cos(lat1) + bX)

  return {
    lat: toDeg(lat3),
    lon: toDeg(lon3),
  }
}

const distance = (point1, point2) => {
  const R = 6371 // km
  const dLat = toRad(point2.lat - point1.lat)
  const dlon = toRad(point2.lon - point1.lon)
  const radpoint1Lat = toRad(point1.lat)
  const radpoint2Lat = toRad(point2.lat)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dlon / 2) *
      Math.sin(dlon / 2) *
      Math.cos(radpoint1Lat) *
      Math.cos(radpoint2Lat)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

module.exports = {
  toDeg,
  toRad,
  middlePoint,
  distance,
}
