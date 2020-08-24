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

const handleDropdownSelect = (propertyName, callback) => ({
  name,
  lon,
  lat,
}) => {
  return callback((currentState) => ({
    ...currentState,
    [propertyName]: {
      name,
      lon,
      lat,
    },
  }))
}

export default {
  handleTextInputChange,
  handleContactInputChange,
  handleDropdownSelect,
}
