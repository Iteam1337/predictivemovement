import React from 'react'
import styled from 'styled-components'
import BookingTimeRestriction from './BookingTimeRestriction'
import Elements from '../Elements'

const TimeRestrictionInputPairContainer = styled.div`
  display: flex;
  justify-content: space-between;
`
const Component = ({ onChangeHandler, timewindow, typeProperty }) => {
  const timeRestrictionInputRef = React.useRef()
  return (
    <TimeRestrictionInputPairContainer>
      <div style={{ width: '49%' }}>
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
      </div>
      <div style={{ width: '49%' }}>
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
      </div>
    </TimeRestrictionInputPairContainer>
  )
}

export default Component
