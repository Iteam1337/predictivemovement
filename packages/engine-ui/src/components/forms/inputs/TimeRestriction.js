import React from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import * as Elements from '../../../shared-elements'
import DateInput from './DateInput'
import * as helpers from '../../../utils/helpers'
import styled from 'styled-components'

const Wrapper = styled.div`
  width: '100%';
  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background-color: #13c57b;
  }

  .react-datepicker__day,
  .react-datepicker__day--selected:focus,
  .react-datepicker__day--selected:active {
    outline-color: #13c57b;
  }

  .react-datepicker__time-container
    .react-datepicker__time
    .react-datepicker__time-box
    ul.react-datepicker__time-list
    li.react-datepicker__time-list-item--selected {
    background-color: #13c57b;
  }
`

const BookingTimeRestriction = ({
  selected,
  onChangeHandler,
  placeholderText,
  inputElement,
  minDate = new Date(),
}) => {
  return (
    <Wrapper>
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
    </Wrapper>
  )
}

const VehicleTimeRestriction = ({
  selected,
  onChangeHandler,
  placeholderText,
  inputElement,
}) => {
  return (
    <Wrapper>
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
        timeFormat="HH:mm"
        placeholderText={placeholderText}
        customInput={inputElement}
      />
    </Wrapper>
  )
}

export const BookingTimeRestrictionPair = ({
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

export const VehicleTimeRestrictionPair = ({
  onChangeHandler,
  timewindow,
  handleFocus,
}) => {
  const timeRestrictionInputRef = React.useRef()
  return (
    <Elements.Layout.TextInputPairContainer>
      <Elements.Layout.TextInputPairItem>
        <VehicleTimeRestriction
          selected={timewindow.start}
          onChangeHandler={(date) => onChangeHandler(date, 'start', 'start')}
          placeholderText="Starttid"
          inputElement={
            <DateInput
              handleFocus={handleFocus}
              ref={timeRestrictionInputRef}
              isRequired={false}
            />
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
              isRequired={false}
              handleFocus={handleFocus}
              ref={timeRestrictionInputRef}
            />
          }
        />
      </Elements.Layout.TextInputPairItem>
    </Elements.Layout.TextInputPairContainer>
  )
}
