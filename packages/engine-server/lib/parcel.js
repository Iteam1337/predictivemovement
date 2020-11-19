const fetch = require('node-fetch')
const postnordKey = process.env.POSTNORD_KEY

const search = (id) =>
  fetch(
    `https://api2.postnord.com/rest/shipment/v5/trackandtrace/findByIdentifier.json?apikey=${postnordKey}&id=${id}&locale=en`
  ).then((e) => e.json())

const getWeight = ({
  TrackingInformationResponse: {
    shipments: [shipment],
  },
}) => {
  const { statedMeasurement, assessedMeasurement } = shipment
  if (statedMeasurement && statedMeasurement.weight) {
    return translateToKgInt(statedMeasurement.weight)
  } else if (assessedMeasurement && assessedMeasurement.weight) {
    return translateToKgInt(assessedMeasurement.weight)
  } else {
    return null
  }
}

const translateToKgInt = ({ value, unit }) => {
  const valueAsInt = Math.round(parseFloat(value))
  if (unit === 'g') return valueAsInt * 1000
  return valueAsInt
}

const getMeasurements = ({
  TrackingInformationResponse: {
    shipments: [shipment],
  },
}) => {
  const { statedMeasurement, assessedMeasurement } = shipment

  if (hasAllMeasurements(statedMeasurement)) {
    const { width, height, length } = statedMeasurement
    return [width, height, length].map(translateToCm)
  } else if (hasAllMeasurements(assessedMeasurement)) {
    const { width, height, length } = assessedMeasurement
    return [width, height, length].map(translateToCm)
  } else {
    return null
  }
}

const hasAllMeasurements = (data) => {
  if (!data) return false

  return ['length', 'height', 'width'].every((key) =>
    Object.keys(data).includes(key)
  )
}

const translateToCm = ({ value, unit }) => {
  switch (unit) {
    case 'mm':
      return value * 10
    case 'cm':
      return value
    case 'dm':
      return value / 10
    case 'm':
      return value / 100
  }
}

module.exports = {
  search,
  getWeight,
  getMeasurements,
}
