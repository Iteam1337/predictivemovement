const fetch = require('node-fetch')
const postnordKey = process.env.POSTNORD_KEY
if (!postnordKey) console.warn('Postnord key not set!')

const search = (id) =>
  fetch(
    `https://api2.postnord.com/rest/shipment/v5/trackandtrace/findByIdentifier.json?apikey=${postnordKey}&id=${id}&locale=en`
  ).then((e) => e.json())

const getWeight = ({
  TrackingInformationResponse: {
    shipments: [shipment],
  },
}) => {
  if (!shipment) {
    return null
  }
  const {
    items: [{ statedMeasurement, assessedMeasurement }],
    totalWeight,
    assessedWeight,
  } = shipment
  if (statedMeasurement && statedMeasurement.weight) {
    return translateToKgInt(statedMeasurement.weight)
  } else if (totalWeight) {
    return translateToKgInt(totalWeight)
  } else if (assessedMeasurement && assessedMeasurement.weight) {
    return translateToKgInt(assessedMeasurement.weight)
  } else if (assessedWeight) {
    return translateToKgInt(assessedWeight)
  } else {
    return null
  }
}

const translateToKgInt = ({ value, unit }) => {
  let valueAsFloat = parseFloat(value)
  if (unit === 'g') valueAsFloat /= 1000

  return Math.max(Math.round(valueAsFloat), 1)
}

const getMeasurements = ({
  TrackingInformationResponse: {
    shipments: [shipment],
  },
}) => {
  if (!shipment) {
    return null
  }
  const {
    items: [{ statedMeasurement, assessedMeasurement }],
  } = shipment

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
  let valueAsFloat = parseFloat(value)
  switch (unit) {
    case 'mm':
      valueAsFloat /= 10
      break
    case 'cm':
      break
    case 'dm':
      valueAsFloat *= 10
      break
    case 'm':
      valueAsFloat *= 100
      break
  }
  return Math.max(Math.round(valueAsFloat), 1)
}

module.exports = {
  search,
  getWeight,
  getMeasurements,
}
