const handleTextInputChange = (propertyName, callback) => (event) => {
  event.persist()

  return callback((currentState) => ({
    ...currentState,
    [propertyName]: event.target.value,
  }))
}

const handleContactInputChange = (
  propertyName,
  nestedPropertyName,
  callback
) => (event) => {
  event.persist()
  return callback((currentState) => ({
    ...currentState,
    [propertyName]: {
      ...currentState[propertyName],
      [nestedPropertyName]: event.target.value,
    },
  }))
}

const handleAddressInputForBooking = (
  propertyName,
  callback,
  setFormErrors
) => ({ name = '', street = '', lon, lat, county = '' }) => {
  setFormErrors((prev) => ({ ...prev, [propertyName]: false }))
  return callback((currentState) => ({
    ...currentState,
    [propertyName]: {
      name,
      lon,
      lat,
      city: county,
      street,
    },
  }))
}

const handleAddressInput = (propertyName, callback) => ({
  name = '',
  street = '',
  lon,
  lat,
  county = '',
}) =>
  callback((currentState) => ({
    ...currentState,
    [propertyName]: {
      name,
      lon,
      lat,
      city: county,
      street,
    },
  }))

export default {
  handleTextInputChange,
  handleContactInputChange,
  handleAddressInput,
  handleAddressInputForBooking,
}
