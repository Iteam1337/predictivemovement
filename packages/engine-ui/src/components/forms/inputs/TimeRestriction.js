import React from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import Elements from '../../../shared-elements'
import DateInput from './DateInput'
import helpers from '../../../utils/helpers'

const BookingTimeRestriction = ({
  selected,
  onChangeHandler,
  placeholderText,
  inputElement,
  minDate = new Date(),
}) => {
  return (
    <div style={{ width: '100%' }}>
      <DatePicker
        selected={selected}
        onChange={onChangeHandler}
        showTimeSelect
        excludeOutOfBoundsTimes
        minTime={helpers.calculateMinTime(selected)}
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

const VehicleTimeRestriction = ({
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

const BookingTimeRestrictionPair = ({
  onChangeHandler,
  timewindow,
  typeProperty,
}) => {
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
          inputElement={<DateInput ref={timeRestrictionInputRef} withIcon />}
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
          inputElement={<DateInput withIcon ref={timeRestrictionInputRef} />}
        />
      </Elements.Layout.TextInputPairItem>
    </Elements.Layout.TextInputPairContainer>
  )
}

const VehicleTimeRestrictionPair = ({ onChangeHandler, timewindow }) => {
  const timeRestrictionInputRef = React.useRef()
  return (
    <Elements.Layout.TextInputPairContainer>
      <Elements.Layout.TextInputPairItem>
        <VehicleTimeRestriction
          selected={timewindow.start}
          onChangeHandler={(date) => onChangeHandler(date, 'start', 'start')}
          placeholderText="Starttid"
          inputElement={
            <DateInput ref={timeRestrictionInputRef} />
          }
        />
      </Elements.Layout.TextInputPairItem>
      <Elements.Layout.TextInputPairItem>
        <VehicleTimeRestriction
          selected={timewindow.end}
          minDate={timewindow.start ? new Date(timewindow.start) : new Date()}
          onChangeHandler={(date) => onChangeHandler(date, 'end', 'end')}
          placeholderText="Sluttid"
          inputElement={
            <DateInput
              ref={timeRestrictionInputRef}
            />
          }
        />
      </Elements.Layout.TextInputPairItem>
    </Elements.Layout.TextInputPairContainer>
  )
}

export default { BookingTimeRestrictionPair, VehicleTimeRestrictionPair }
