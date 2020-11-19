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
  const valueAsFloat = parseFloat(value)
  if (unit === 'g') return Math.round(valueAsFloat / 1000)
  return Math.round(valueAsFloat)
}

const getMeasurements = ({
  TrackingInformationResponse: {
    shipments: [shipment],
  },
}) => {
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
  const valueAsFloat = parseFloat(value)
  switch (unit) {
    case 'mm':
      return Math.round(valueAsFloat / 10)
    case 'cm':
      return Math.round(valueAsFloat)
    case 'dm':
      return Math.round(valueAsFloat * 10)
    case 'm':
      return Math.round(valueAsFloat * 100)
  }
}

module.exports = {
  search,
  getWeight,
  getMeasurements,
}
