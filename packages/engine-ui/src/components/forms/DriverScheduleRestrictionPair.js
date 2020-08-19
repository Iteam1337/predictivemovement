import React from 'react'
import DriverScheduleRestriction from './DriverScheduleRestriction'
import Elements from '../Elements'

const Component = ({ onChangeHandler, timewindow }) => {
  const timeRestrictionInputRef = React.useRef()
  return (
    <Elements.TextInputPairContainer>
      <Elements.TextInputPairItem>
        <DriverScheduleRestriction
          selected={timewindow.start}
          onChangeHandler={(date) => onChangeHandler(date, 'start', 'start')}
          placeholderText="Starttid"
          inputElement={
            <Elements.TimeRestrictionDateInput ref={timeRestrictionInputRef} />
          }
        />
      </Elements.TextInputPairItem>
      <Elements.TextInputPairItem>
        <DriverScheduleRestriction
          selected={timewindow.end}
          minDate={timewindow.start ? new Date(timewindow.start) : new Date()}
          onChangeHandler={(date) => onChangeHandler(date, 'end', 'end')}
          placeholderText="Sluttid"
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
