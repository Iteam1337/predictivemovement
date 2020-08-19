import moment from 'moment'

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

const calculateMinTime = (date, minDate) => {
  const momentDate = moment(date || minDate)
  const isToday = momentDate.isSame(moment(), 'day')
  if (isToday) {
    const nowAddOneHour = momentDate.add({ hours: 1 }).toDate()
    return nowAddOneHour
  }
  return moment().startOf('day').toDate() // set to 12:00 am today
}

export default {
  calculateMinTime,
  handleTextInputChange,
  handleContactInputChange,
  handleDropdownSelect,
}
