import React from 'react'
import DatePicker from 'react-datepicker'

const Component = ({
  timeRestriction,
  onChangeHandler,
  placeholderText,
  inputElement,
}) => {
  return (
    <div style={{ width: '100%' }}>
      <DatePicker
        id="startDate"
        selected={timeRestriction}
        onChange={onChangeHandler}
        showTimeSelect
        minDate={new Date()}
        timeFormat="HH:mm"
        timeIntervals={30}
        timeCaption="time"
        dateFormat="MMMM d, yyyy H:mm"
        required
        placeholderText={placeholderText}
        customInput={inputElement}
      />
    </div>
  )
}

export default Component
