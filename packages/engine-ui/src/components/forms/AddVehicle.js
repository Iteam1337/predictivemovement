import React from 'react'
import Elements from '../Elements'
import AddressSearchInput from './AddressSearchInput'
import DriverScheduleRestriction from './DriverScheduleRestriction'
import styled from 'styled-components'
import TextInput from './TextInput'
import phoneIcon from '../../assets/contact-phone.svg'
import nameIcon from '../../assets/contact-name.svg'
import { useHistory } from 'react-router-dom'
import formHelpers from './formHelpers'
const TimeRestrictionWrapper = styled.div`
  .react-datepicker-wrapper {
    width: 100%;
  }
`

const Component = ({ onChangeHandler, onSubmitHandler, state }) => {
  const timeRestrictionInputRef = React.useRef()
  const history = useHistory()

  const handleBookingTimeRestrictionChange = (date, property) =>
    onChangeHandler((currentState) => {
      return {
        ...currentState,
        timewindow: { ...currentState.timewindow, [property]: date },
      }
    })

  // const handleScheduleInputChange = (propertyName) => (event) => {
  //   event.persist()

  //   return onChangeHandler((currentState) => ({
  //     ...currentState,
  //     [propertyName]: event.target.value,
  //   }))
  // }

  return (
    <form onSubmit={onSubmitHandler} autoComplete="off">
      <Elements.InputBlock>
        <Elements.InputContainer>
          <Elements.Label htmlFor="vehicleType">Namn på fordon</Elements.Label>
          <TextInput
            name="vehicleType"
            value={state.vehicleType}
            placeholder="Paketbil"
            onChangeHandler={formHelpers.handleTextInputChange(
              'vehicleType',
              onChangeHandler
            )}
          />
        </Elements.InputContainer>
      </Elements.InputBlock>
      <Elements.InputBlock>
        <Elements.InputContainer>
          <Elements.Label htmlFor="capacity">Kapacitet</Elements.Label>
          <TextInput
            name="capacity"
            value={state.capacity}
            onChangeHandler={formHelpers.handleTextInputChange(
              'capacity',
              onChangeHandler
            )}
            placeholder="Lastvolym"
          />
        </Elements.InputContainer>
      </Elements.InputBlock>
      <Elements.InputBlock>
        <Elements.InputContainer>
          <Elements.Label>Körschema</Elements.Label>
          <Elements.InputContainer>
            <TimeRestrictionWrapper>
              <Elements.TextInputPairContainer>
                <Elements.TextInputPairItem>
                  <DriverScheduleRestriction
                    selected={state.timewindow.start}
                    onChangeHandler={(date) =>
                      handleBookingTimeRestrictionChange(date, 'start', 'start')
                    }
                    placeholderText="Starttid"
                    inputElement={
                      <Elements.TimeRestrictionDateInput
                        ref={timeRestrictionInputRef}
                      />
                    }
                  />
                </Elements.TextInputPairItem>
                <Elements.TextInputPairItem>
                  <DriverScheduleRestriction
                    selected={state.timewindow.end}
                    onChangeHandler={(date) =>
                      handleBookingTimeRestrictionChange(date, 'end', 'end')
                    }
                    placeholderText="Sluttid"
                    inputElement={
                      <Elements.TimeRestrictionDateInput
                        ref={timeRestrictionInputRef}
                      />
                    }
                  />
                </Elements.TextInputPairItem>
              </Elements.TextInputPairContainer>
            </TimeRestrictionWrapper>
          </Elements.InputContainer>
          <AddressSearchInput
            placeholder="Slutposition"
            onChangeHandler={formHelpers.handleDropdownSelect(
              'endDestination',
              onChangeHandler
            )}
          />
        </Elements.InputContainer>
      </Elements.InputBlock>
      <Elements.InputBlock>
        <Elements.InputContainer>
          <Elements.Label htmlFor="driver">Chaufför</Elements.Label>
          <Elements.InputInnerContainer>
            <Elements.FormInputIcon
              alt="Contact name icon"
              src={`${nameIcon}`}
            />
            <TextInput
              iconInset
              name="driver"
              value={state.driver.name}
              onChangeHandler={formHelpers.handleContactInputChange(
                'driver',
                'name',
                onChangeHandler
              )}
              placeholder="Peter Persson"
            />
          </Elements.InputInnerContainer>
        </Elements.InputContainer>
        <Elements.InputContainer>
          <Elements.Label htmlFor="contact">Kontakt</Elements.Label>
          <Elements.InputInnerContainer>
            <Elements.FormInputIcon
              alt="Contact number icon"
              src={`${phoneIcon}`}
            />
            <TextInput
              iconInset
              name="contact"
              value={state.driver.contact}
              onChangeHandler={formHelpers.handleContactInputChange(
                'driver',
                'contact',
                onChangeHandler
              )}
              placeholder="070-123 45 67"
            />
          </Elements.InputInnerContainer>
        </Elements.InputContainer>
      </Elements.InputBlock>

      <Elements.ButtonWrapper>
        <Elements.CancelButton type="button" onClick={() => history.push('/')}>
          Avbryt
        </Elements.CancelButton>
        <Elements.SubmitButton type="submit">Lägg till</Elements.SubmitButton>
      </Elements.ButtonWrapper>
    </form>
  )
}

export default Component
