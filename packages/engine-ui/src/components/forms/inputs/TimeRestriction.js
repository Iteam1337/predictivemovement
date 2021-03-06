import React from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import * as Elements from '../../../shared-elements'
import DateInput from './DateInput'
import * as helpers from '../../../utils/helpers'
import styled from 'styled-components'
import { useField, useFormikContext } from 'formik'

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

  .react-datepicker-popper {
    z-index: 100;
  }

  .react-datepicker__time-container
    .react-datepicker__time
    .react-datepicker__time-box
    ul.react-datepicker__time-list
    li.react-datepicker__time-list-item--selected {
    background-color: #13c57b;
  }

  @media (max-width: 645px) {
    .react-datepicker__time-container,
    .react-datepicker__time-box {
      width: 70px;
    }
  }
`

const BookingTimeRestriction = ({
  selected,
  placeholderText,
  inputElement,
  minDate,
  name,
}) => {
  const { setFieldValue } = useFormikContext()
  const [field] = useField(name)

  return (
    <Wrapper>
      <DatePicker
        {...field}
        onChange={(val) => {
          setFieldValue(field.name, val)
        }}
        selected={(field.value && new Date(field.value)) || null}
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
        popperModifiers={{
          preventOverflow: {
            enabled: true,
          },
        }}
      />
    </Wrapper>
  )
}

const TransportTimeRestriction = ({ placeholderText, inputElement, name }) => {
  const { setFieldValue } = useFormikContext()
  const [field] = useField(name)
  return (
    <Wrapper>
      <DatePicker
        {...field}
        onChange={(val) => setFieldValue(field.name, val)}
        selected={(field.value && new Date(field.value)) || null}
        showTimeSelect
        showTimeSelectOnly
        id="startTime"
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

export const BookingTimeRestrictionPair = ({ name }) => {
  const timeRestrictionInputRef = React.useRef()
  const [field] = useField(name)

  return (
    <Elements.Layout.TextInputPairContainer>
      <Elements.Layout.TextInputPairItem>
        <BookingTimeRestriction
          name={`${name}.earliest`}
          placeholderText="Tidigast"
          inputElement={<DateInput ref={timeRestrictionInputRef} withIcon />}
        />
      </Elements.Layout.TextInputPairItem>
      <Elements.Layout.TextInputPairItem>
        <BookingTimeRestriction
          name={`${name}.latest`}
          minDate={
            field.value && field.value.earliest
              ? new Date(field.value.earliest)
              : new Date()
          }
          placeholderText="Senast"
          inputElement={<DateInput withIcon ref={timeRestrictionInputRef} />}
        />
      </Elements.Layout.TextInputPairItem>
    </Elements.Layout.TextInputPairContainer>
  )
}

export const TransportTimeRestrictionPair = ({ handleFocus }) => {
  const timeRestrictionInputRef = React.useRef()
  const { values } = useFormikContext()
  return (
    <Elements.Layout.TextInputPairContainer>
      <Elements.Layout.TextInputPairItem>
        <TransportTimeRestriction
          name="earliestStart"
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
        <TransportTimeRestriction
          name="latestEnd"
          minDate={
            values.earliestStart ? new Date(values.earliestStart) : new Date()
          }
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
