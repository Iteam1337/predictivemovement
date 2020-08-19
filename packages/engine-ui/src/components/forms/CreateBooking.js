import React from 'react'
import Elements from '../Elements'
import AddressSearchInput from './AddressSearchInput'
import BookingTimeRestrictionPair from './BookingTimeRestrictionPair'
import styled from 'styled-components'
import TextInput from './TextInput'
import phoneIcon from '../../assets/contact-phone.svg'
import nameIcon from '../../assets/contact-name.svg'
import formHelpers from './formHelpers'
const TimeRestrictionWrapper = styled.div`
  .react-datepicker-wrapper {
    width: 100%;
  }
`

const AddAdditionalTimeRestrictionsButton = styled.button`
  border: none;
  background: transparent;
  font-weight: bold;
  color: currentColor;
`

const Component = ({ onChangeHandler, onSubmitHandler, state }) => {
  const [
    showBookingTimeRestriction,
    setShowBookingTimeRestriction,
  ] = React.useState({ pickup: false, delivery: false })

  const handleBookingTimeRestrictionChange = (targetIndex) => (
    date,
    type,
    property
  ) =>
    onChangeHandler((currentState) => {
      return {
        ...currentState,
        [type]: {
          ...currentState[type],
          timewindows: [
            ...currentState[type].timewindows,
          ].map((timewindow, index) =>
            index === targetIndex
              ? { ...currentState[type].timewindows[index], [property]: date }
              : timewindow
          ),
        },
      }
    })

  const addTimeRestrictionWindow = (type) =>
    onChangeHandler((currentState) => ({
      ...currentState,
      [type]: {
        ...currentState[type],
        timewindows: [
          ...(currentState[type].timewindows || []),
          { earliest: null, latest: null },
        ],
      },
    }))

  const handleToggleTimeRestrictionsChange = (propertyName) => {
    setShowBookingTimeRestriction((currentState) => ({
      ...currentState,
      [propertyName]: !currentState[propertyName],
    }))

    return state[propertyName].timewindows
      ? onChangeHandler((currentState) => ({
          ...currentState,
          [propertyName]: { ...currentState[propertyName], timewindows: null },
        }))
      : addTimeRestrictionWindow(propertyName)
  }

  return (
    <form onSubmit={onSubmitHandler} autoComplete="off">
      <Elements.InputBlock>
        <Elements.InputContainer>
          <Elements.Label htmlFor="parceldetails" />
          <TextInput
            name="id"
            value={state.id}
            placeholder="ID"
            onChangeHandler={formHelpers.handleTextInputChange(
              'id',
              onChangeHandler
            )}
          />
        </Elements.InputContainer>
        <Elements.InputContainer>
          <Elements.TextInputPairContainer>
            <Elements.TextInputPairItem>
              <TextInput
                name="measurement"
                value={state.measurement}
                placeholder="Mått (BxHxD)"
                onChangeHandler={formHelpers.handleTextInputChange(
                  'measurement',
                  onChangeHandler
                )}
              />
            </Elements.TextInputPairItem>
            <Elements.TextInputPairItem>
              <TextInput
                step={0.1}
                name="weight"
                value={state.weight}
                placeholder="Vikt (kg)"
                type="number"
                onChangeHandler={formHelpers.handleTextInputChange(
                  'weight',
                  onChangeHandler
                )}
              />
            </Elements.TextInputPairItem>
          </Elements.TextInputPairContainer>
        </Elements.InputContainer>

        <Elements.InputContainer>
          <TextInput
            name="cargo"
            value={state.cargo}
            onChangeHandler={formHelpers.handleTextInputChange(
              'cargo',
              onChangeHandler
            )}
            placeholder="Innehåll"
          />
        </Elements.InputContainer>
      </Elements.InputBlock>

      <Elements.InputContainer>
        <Elements.Label htmlFor="pickup">Upphämtning</Elements.Label>
        <AddressSearchInput
          placeholder="T.ex. BARNSTUGEVÄGEN 22"
          onChangeHandler={formHelpers.handleDropdownSelect(
            'pickup',
            onChangeHandler
          )}
        />
        <Elements.Checkbox
          label="Tidspassning"
          onChangeHandler={() => handleToggleTimeRestrictionsChange('pickup')}
        />
        <TimeRestrictionWrapper>
          {showBookingTimeRestriction.pickup &&
            state.pickup.timewindows &&
            state.pickup.timewindows.map((timewindow, index) => (
              <BookingTimeRestrictionPair
                typeProperty="pickup"
                key={index}
                timewindow={timewindow}
                onChangeHandler={handleBookingTimeRestrictionChange(index)}
              />
            ))}
          {showBookingTimeRestriction.pickup && state.pickup.timewindows && (
            <AddAdditionalTimeRestrictionsButton
              type="button"
              onClick={() => addTimeRestrictionWindow('pickup')}
            >
              + Lägg till fler
            </AddAdditionalTimeRestrictionsButton>
          )}
        </TimeRestrictionWrapper>
      </Elements.InputContainer>
      <Elements.InputBlock>
        <Elements.InputContainer>
          <Elements.Label htmlFor="sender-name">Avsändare</Elements.Label>
          <Elements.InputInnerContainer>
            <Elements.FormInputIcon
              alt="Contact name icon"
              src={`${nameIcon}`}
            />
            <TextInput
              name="sendername"
              value={state.sender.name}
              onChangeHandler={formHelpers.handleContactInputChange(
                'sender',
                'name',
                onChangeHandler
              )}
              placeholder="Sportbutiken AB"
              iconInset
            />
          </Elements.InputInnerContainer>
        </Elements.InputContainer>
      </Elements.InputBlock>
      <Elements.InputBlock>
        <Elements.InputContainer>
          <Elements.Label htmlFor="sender-contact">Kontakt</Elements.Label>
          <Elements.InputInnerContainer>
            <Elements.FormInputIcon
              alt="Contact phone icon"
              src={`${phoneIcon}`}
            />
            <TextInput
              iconInset
              name="sender"
              type="tel"
              value={state.sender.contact}
              onChangeHandler={formHelpers.handleContactInputChange(
                'sender',
                'contact',
                onChangeHandler
              )}
              placeholder="070-123 45 67"
            />
          </Elements.InputInnerContainer>
        </Elements.InputContainer>
      </Elements.InputBlock>

      <Elements.InputContainer>
        <Elements.Label htmlFor="delivery">Avlämning</Elements.Label>
        <AddressSearchInput
          placeholder="T.ex. BARNSTUGEVÄGEN 7"
          onChangeHandler={formHelpers.handleDropdownSelect(
            'delivery',
            onChangeHandler
          )}
        />
        <Elements.Checkbox
          label="Tidspassning"
          onChangeHandler={() =>
            handleToggleTimeRestrictionsChange('delivery', onChangeHandler)
          }
        />
        <TimeRestrictionWrapper>
          {showBookingTimeRestriction.delivery &&
            state.delivery.timewindows &&
            state.delivery.timewindows.map((timewindow, index) => {
              return (
                <BookingTimeRestrictionPair
                  typeProperty="delivery"
                  key={index}
                  timewindow={timewindow}
                  onChangeHandler={handleBookingTimeRestrictionChange(index)}
                />
              )
            })}
          {showBookingTimeRestriction.delivery && state.delivery.timewindows && (
            <AddAdditionalTimeRestrictionsButton
              type="button"
              onClick={() => addTimeRestrictionWindow('delivery')}
            >
              + Lägg till fler
            </AddAdditionalTimeRestrictionsButton>
          )}
        </TimeRestrictionWrapper>
      </Elements.InputContainer>
      <Elements.InputBlock>
        <Elements.InputContainer>
          <Elements.Label htmlFor="recipient-name">Mottagare</Elements.Label>
          <Elements.InputInnerContainer>
            <Elements.FormInputIcon
              alt="Contact name icon"
              src={`${nameIcon}`}
            />
            <TextInput
              iconInset
              name="recipient-name"
              value={state.recipient.name}
              onChangeHandler={formHelpers.handleContactInputChange(
                'recipient',
                'name',
                onChangeHandler
              )}
              placeholder="Anna Andersson"
            />
          </Elements.InputInnerContainer>
        </Elements.InputContainer>
      </Elements.InputBlock>
      <Elements.InputBlock>
        <Elements.InputContainer>
          <Elements.Label htmlFor="recipient-contact">Kontakt</Elements.Label>
          <Elements.InputInnerContainer>
            <Elements.FormInputIcon
              alt="Contact phone icon"
              src={`${nameIcon}`}
            />
            <TextInput
              iconInset
              name="recipient-contact"
              type="number"
              value={state.recipient.contact}
              onChangeHandler={formHelpers.handleContactInputChange(
                'recipient',
                'contact',
                onChangeHandler
              )}
              placeholder="070-123 45 67"
            />
          </Elements.InputInnerContainer>
        </Elements.InputContainer>
      </Elements.InputBlock>
      <Elements.ButtonWrapper>
        <Elements.CancelButton
          type="button"
          onClick={() => console.log('canceling')}
        >
          Avbryt
        </Elements.CancelButton>
        <Elements.SubmitButton type="submit">Lägg till</Elements.SubmitButton>
      </Elements.ButtonWrapper>
    </form>
  )
}

export default Component
