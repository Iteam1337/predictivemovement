import React from 'react'
import { Booking } from '../../types'
import * as Elements from '../../shared-elements'
import Form from '../forms/CreateBooking'
import * as stores from '../../utils/state/stores'
import * as hooks from '../../utils/hooks'

interface Props {
  booking: Booking
  updateBooking: (params: any) => void
  setIsFinished: (isFinished: boolean) => void
}

export interface FormBooking extends Omit<Booking, 'size'> {
  [key: string]: any
  size: {
    measurements: string
    weight: string
  }
}

const parcelSizePresets = {
  small: { weight: '1', measurements: '18x18x18' },
  medium: { weight: '10', measurements: '24x24x24' },
  big: { weight: '50', measurements: '36x36x36' },
}

const isValidAddress = ({ lat, lon }: { lat: number; lon: number }) =>
  !!(lat && lon)

const EditBooking = ({ booking, updateBooking, setIsFinished }: Props) => {
  const formBooking = {
    ...booking,
    size: {
      weight: booking.size.weight ? booking.size.weight.toString() : '',
      measurements: booking.size.measurements
        ? booking.size.measurements.join('x')
        : '',
    },
    pickup: {
      ...booking.pickup,
      timeWindows:
        booking.pickup.timeWindows?.map((t) => ({
          earliest: t.earliest ? new Date(t.earliest) : '',
          latest: t.latest ? new Date(t.latest) : '',
        })) || null,
    },
    delivery: {
      ...booking.delivery,
      timeWindows:
        booking.delivery.timeWindows?.map((t) => ({
          earliest: t.earliest ? new Date(t.earliest) : '',
          latest: t.latest ? new Date(t.latest) : '',
        })) || null,
    },
  }

  const [state, setState] = React.useState(formBooking)

  const setUIState = stores.ui((state) => state.dispatch)
  hooks.useFormStateWithMapClickControl('pickup', 'delivery', setState)

  const [formErrors, setFormErrors] = React.useState({
    pickup: false,
    delivery: false,
  })

  const onSubmitHandler = (event: any) => {
    event.preventDefault()

    const validationResult = {
      pickup: isValidAddress(state.pickup),
      delivery: isValidAddress(state.delivery),
    }

    if (!validationResult.pickup || !validationResult.delivery) {
      setFormErrors((formErrors) => ({
        ...formErrors,
        pickup: !validationResult.pickup,
        delivery: !validationResult.delivery,
      }))

      return false
    }

    updateBooking({
      ...state,
      size: {
        ...state.size,
        measurements: state.size.measurements
          ? state.size.measurements.split('x').map(parseFloat)
          : null,
        weight: parseInt(state.size.weight) || 0,
      },
    })

    return setIsFinished(true)
  }

  return (
    <Elements.Layout.Container>
      <h3>Uppdatera bokning</h3>
      <Form
        type="edit"
        setFormErrors={setFormErrors}
        formErrors={formErrors}
        onChangeHandler={setState}
        onSubmitHandler={onSubmitHandler}
        state={state}
        dispatch={setUIState}
        parcelSizePresets={parcelSizePresets}
      />
    </Elements.Layout.Container>
  )
}

export default EditBooking
