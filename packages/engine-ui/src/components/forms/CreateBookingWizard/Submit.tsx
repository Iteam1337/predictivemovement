import React from 'react'
import * as Elements from '../../../shared-elements'
import * as FormInputs from '../inputs'
import { FormikProps, useFormikContext } from 'formik'
import { BookingFormState } from '../../CreateBooking'
import { FormBooking } from '../../EditBooking/EditBooking'
import { useHistory } from 'react-router'

const getSizePreset = (
  { size: { weight, measurements } }: BookingFormState | FormBooking,
  presets: any
) => {
  if (!weight || !measurements) {
    return {
      weight: '',
      measurements: '',
    }
  }

  return Object.keys(presets).find(
    (p) =>
      measurements === presets[p].measurements && weight === presets[p].weight
  )
}

const Submit: React.FC<{
  dispatch: any
  parcelSizePresets: {
    [s: string]: {
      weight: number
      measurements: string
    }
  }
  type?: 'NEW' | 'EDIT'
}> = ({ parcelSizePresets, dispatch, type }) => {
  const { values }: FormikProps<BookingFormState> = useFormikContext()
  const history = useHistory()
  const sizePreset = getSizePreset(values, parcelSizePresets) || 'custom'
  const [useCustomSize, setUseCustomSize] = React.useState(
    sizePreset === 'custom'
  )

  const handleParcelSearchResults = ({
    weight,
    measurements,
  }: {
    weight: number
    measurements: string
  }) => {
    if (!weight || !measurements) return null

    setUseCustomSize(true)
  }
  return (
    <>
      <Elements.Layout.MarginBottomContainer />
      <Elements.Layout.InputBlock>
        <Elements.Layout.InputContainer>
          <Elements.Form.Label htmlFor="size" required>
            Hur stor är försändelsen?
          </Elements.Form.Label>

          <FormInputs.ParcelSize
            parcelSizePresets={parcelSizePresets}
            useCustomSize={useCustomSize}
            setUseCustomSize={setUseCustomSize}
            name="size"
          />
        </Elements.Layout.InputContainer>
      </Elements.Layout.InputBlock>
      <Elements.Layout.InputBlock>
        <Elements.Layout.InputContainer>
          <Elements.Form.Label htmlFor="parceldetails">
            Paketspecifikationer
          </Elements.Form.Label>
          <FormInputs.ExternalIdSearchInput
            id="parceldetails"
            placeholder="Referensnummer från avsändare"
            name="externalId"
            onFocus={() =>
              dispatch({
                type: 'focusInput',
                payload: 'start',
              })
            }
            onSearchResult={handleParcelSearchResults}
          />
        </Elements.Layout.InputContainer>
        <Elements.Layout.InputContainer>
          <FormInputs.TextInput name="metadata.cargo" placeholder="Innehåll" />
        </Elements.Layout.InputContainer>
        <Elements.Layout.InputContainer>
          <FormInputs.TextInput name="metadata.customer" placeholder="Kund" />
        </Elements.Layout.InputContainer>
      </Elements.Layout.InputBlock>
      <Elements.Buttons.NeutralButton
        type="button"
        padding="0.7rem 1.8rem"
        marginTop="0rem"
        width={'100%'}
        onClick={() => history.push('/bookings/add-booking/delivery')}
      >
        Föregående
      </Elements.Buttons.NeutralButton>
      <Elements.Layout.ButtonWrapper marginTop="1rem">
        <Elements.Buttons.CancelButton
          marginTop="0rem"
          type="button"
          onClick={() => history.push('/bookings')}
          padding="0.75rem 1.25rem"
          width="48.5%"
        >
          Avbryt
        </Elements.Buttons.CancelButton>
        <Elements.Buttons.SubmitButton
          padding="0.75rem 1.25rem"
          width="48.5%"
          type="submit"
        >
          {type !== 'EDIT' ? 'Lägg till' : 'Uppdatera'}
        </Elements.Buttons.SubmitButton>
      </Elements.Layout.ButtonWrapper>
    </>
  )
}

export default Submit
