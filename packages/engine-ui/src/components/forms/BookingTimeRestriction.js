import React from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import formHelpers from './formHelpers'

const Component = ({
  selected,
  onChangeHandler,
  placeholderText,
  inputElement,
  minDate = new Date(),
}) => {
  return (
    <div style={{ width: '100%' }}>
      <DatePicker
        id="startDate"
        selected={selected}
        onChange={onChangeHandler}
        showTimeSelect
        excludeOutOfBoundsTimes
        minTime={formHelpers.calculateMinTime(selected, minDate)}
        maxTime={moment().endOf('day').toDate()}
        startDate={minDate}
        minDate={minDate}
        timeFormat="HH:mm"
        timeIntervals={30}
        timeCaption="time"
        dateFormat="yyyy-MM-dd, HH:mm"
        required
        placeholderText={placeholderText}
        customInput={inputElement}
      />
    </div>
  )
}

export default Component
