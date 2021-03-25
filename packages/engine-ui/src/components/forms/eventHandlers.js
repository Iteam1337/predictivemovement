export const handleTextInputChange = (propertyName, callback) => (event) => {
  event.persist()

  return callback((currentState) => ({
    ...currentState,
    [propertyName]: event.target.value,
  }))
}

export const handleNestedInputChange = (
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

export const handleMetadataNestedInputChange = (
  propertyName,
  nestedPropertyName,
  callback
) => (event) => {
  event.persist()
  return callback((currentState) => ({
    ...currentState,
    metadata: {
      ...currentState.metadata,
      [propertyName]: {
        ...currentState.metadata[propertyName],
        [nestedPropertyName]: event.target.value,
      },
    },
  }))
}

export const handleAddressInputForBooking = (
  propertyName,
  callback,
  setFormErrors
) => ({ name = '', street = '', lon, lat, county = '' }) => {
  setFormErrors((prev) => ({ ...prev, [propertyName]: false }))
  return callback((currentState) => ({
    ...currentState,
    [propertyName]: {
      ...currentState[propertyName],
      name,
      lon,
      lat,
      city: county,
      street,
    },
  }))
}

export const handleAddressInput = (propertyName, callback) => ({
  name = '',
  street = '',
  lon,
  lat,
  county = '',
}) =>
  callback((currentState) => ({
    ...currentState,
    [propertyName]: {
      ...currentState[propertyName],
      name,
      lon,
      lat,
      city: county,
      street,
    },
  }))

export const handleFleetInput = (propertyName, callback) => ({ name }) =>
  callback((currentState) => ({
    ...currentState,
    metadata: {
      ...currentState.metadata,
      [propertyName]: name,
    },
  }))
