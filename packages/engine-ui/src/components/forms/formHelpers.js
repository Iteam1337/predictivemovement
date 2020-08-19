const handleTextInputChange = (propertyName) => (event) => {
  event.persist()

  return onChangeHandler((currentState) => ({
    ...currentState,
    [propertyName]: event.target.value,
  }))
}

const handleContactInputChange = (propertyName, nestedPropertyName) => (
  event
) => {
  event.persist()
  return onChangeHandler((currentState) => ({
    ...currentState,
    [propertyName]: {
      ...currentState[propertyName],
      [nestedPropertyName]: event.target.value,
    },
  }))
}

const handleDropdownSelect = (propertyName) => ({ name, lon, lat }) => {
  return onChangeHandler((currentState) => ({
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
