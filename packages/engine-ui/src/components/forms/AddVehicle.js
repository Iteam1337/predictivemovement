import React from 'react'
import { useHistory } from 'react-router-dom'
import nameIcon from '../../assets/contact-name.svg'
import phoneIcon from '../../assets/contact-phone.svg'
import Elements from '../Elements'
import AddressSearchInput from './AddressSearchInput'
import DriverScheduleRestrictionPair from './DriverScheduleRestrictionPair'
import eventHandlers from './eventHandlers'
import TextInput from './TextInput'

const Component = ({ onChangeHandler, onSubmitHandler, state }) => {
  const history = useHistory()

  const handleDriverTimeRestrictionChange = (date, property) =>
    onChangeHandler((currentState) => {
      return {
        ...currentState,
        timewindow: { ...currentState.timewindow, [property]: date },
      }
    })

  return (
    <form onSubmit={onSubmitHandler} autoComplete="off">
      <Elements.InputBlock>
        <Elements.InputContainer>
          <Elements.Label htmlFor="vehicleType">Namn på fordon</Elements.Label>
          <TextInput
            name="vehicleType"
            value={state.vehicleType}
            placeholder="Paketbil"
            onChangeHandler={eventHandlers.handleTextInputChange(
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
            onChangeHandler={eventHandlers.handleTextInputChange(
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
            <Elements.TimeRestrictionWrapper>
              <DriverScheduleRestrictionPair
                timewindow={state.timewindow}
                onChangeHandler={handleDriverTimeRestrictionChange}
              />
            </Elements.TimeRestrictionWrapper>
          </Elements.InputContainer>
          <AddressSearchInput
            placeholder="Slutposition"
            onChangeHandler={eventHandlers.handleDropdownSelect(
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
              onChangeHandler={eventHandlers.handleContactInputChange(
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
              onChangeHandler={eventHandlers.handleContactInputChange(
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
