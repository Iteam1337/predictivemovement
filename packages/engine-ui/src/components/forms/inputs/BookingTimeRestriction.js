import React from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import Elements from '../../../shared-elements'
import DateInput from './DateInput'

const BookingTimeRestriction = ({
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
        id="startDate"
        selected={selected}
        onChange={onChangeHandler}
        showTimeSelect
        excludeOutOfBoundsTimes
        minTime={calculateMinTime(selected)}
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

const Component = ({ onChangeHandler, timewindow, typeProperty }) => {
  const timeRestrictionInputRef = React.useRef()
  return (
    <Elements.Layout.TextInputPairContainer>
      <Elements.Layout.TextInputPairItem>
        <BookingTimeRestriction
          selected={timewindow.earliest}
          onChangeHandler={(date) =>
            onChangeHandler(date, typeProperty, 'earliest')
          }
          placeholderText="Tidigast"
          inputElement={
            <DateInput
              ref={timeRestrictionInputRef}
              withIcon
            />
          }
        />
      </Elements.Layout.TextInputPairItem>
      <Elements.Layout.TextInputPairItem>
        <BookingTimeRestriction
          selected={timewindow.latest}
          minDate={
            timewindow.earliest ? new Date(timewindow.earliest) : new Date()
          }
          onChangeHandler={(date) =>
            onChangeHandler(date, typeProperty, 'latest')
          }
          placeholderText="Senast"
          inputElement={
            <DateInput
              withIcon
              ref={timeRestrictionInputRef}
            />
          }
        />
      </Elements.Layout.TextInputPairItem>
    </Elements.Layout.TextInputPairContainer>
  )
}



export default Component
