import React from 'react'
import BookingTimeRestriction from './BookingTimeRestriction'
import Elements from '../Elements'

const Component = ({ onChangeHandler, timewindow, typeProperty }) => {
  const timeRestrictionInputRef = React.useRef()
  return (
    <Elements.TextInputPairContainer>
      <Elements.TextInputPairItem>
        <BookingTimeRestriction
          selected={timewindow.earliest}
          onChangeHandler={(date) =>
            onChangeHandler(date, typeProperty, 'earliest')
          }
          placeholderText="Tidigast"
          inputElement={
            <Elements.TimeRestrictionDateInput ref={timeRestrictionInputRef} />
          }
        />
      </Elements.TextInputPairItem>
      <Elements.TextInputPairItem>
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
            <Elements.TimeRestrictionDateInput
              withIcon={false}
              ref={timeRestrictionInputRef}
            />
          }
        />
      </Elements.TextInputPairItem>
    </Elements.TextInputPairContainer>
  )
}

export default Component
