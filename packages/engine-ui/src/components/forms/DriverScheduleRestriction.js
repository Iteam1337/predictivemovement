import React from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'

const Component = ({
  selected,
  onChangeHandler,
  placeholderText,
  inputElement,
  minDate = new Date(),
}) => {
  const calculateMinTime = (date) => {
    const momentDate = moment(date || minDate)
    const isToday = momentDate.isSame(moment(), 'day')
    if (isToday) {
      const nowAddOneHour = momentDate.add({ hours: 1 }).toDate()
      return nowAddOneHour
    }
    return moment().startOf('day').toDate() // set to 12:00 am today
  }

  return (
    <div style={{ width: '100%' }}>
      <DatePicker
        id="startTime"
        selected={selected}
        onChange={onChangeHandler}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        timeCaption="time"
        dateFormat="H:mm"
        excludeOutOfBoundsTimes
        minTime={calculateMinTime(selected)}
        maxTime={moment().endOf('day').toDate()}
        timeFormat="HH:mm"
        placeholderText={placeholderText}
        customInput={inputElement}
      />
    </div>
  )
}

export default Component
