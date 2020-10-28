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

export const handleAddressInput = (propertyName, callback) => ({
  name = '',
  street = '',
  lon,
  lat,
  county = '',
}) => {
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
