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

const handleAddressInput = (propertyName, callback) => ({
  name = '',
  lon = '',
  lat = '',
  county = '',
}) => {
  return callback((currentState) => ({
    ...currentState,
    [propertyName]: {
      name,
      lon,
      lat,
      city: county,
      street: name,
    },
  }))
}

export default {
  handleTextInputChange,
  handleContactInputChange,
  handleAddressInput,
}
