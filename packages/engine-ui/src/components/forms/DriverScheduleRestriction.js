import React from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import helpers from '../../utils/helpers'

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
        id="startTime"
        selected={selected}
        onChange={onChangeHandler}
        showTimeSelect
        showTimeSelectOnly
        timeIntervals={15}
        timeCaption="time"
        dateFormat="H:mm"
        excludeOutOfBoundsTimes
        minTime={helpers.calculateMinTime(selected, minDate)}
        maxTime={moment().endOf('day').toDate()}
        timeFormat="HH:mm"
        placeholderText={placeholderText}
        customInput={inputElement}
      />
    </div>
  )
}

export default Component
