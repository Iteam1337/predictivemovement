import React from 'react'
import { useParams } from 'react-router-dom'
import { Booking } from '../types'
import MainRouteLayout from './layout/MainRouteLayout'
import * as Elements from '../shared-elements'
import Form from './forms/CreateBooking'
import * as stores from '../utils/state/stores'
import * as helpers from '../utils/helpers'
import { initialState } from './CreateBooking'
interface Props {
  bookings: Booking[]
}
const parcelSizePresets = {
  small: { weight: 1, measurements: '18x18x18' },
  medium: { weight: 10, measurements: '24x24x24' },
  big: { weight: 50, measurements: '36x36x36' },
}

const setAddressFromCoordinates = async (
  pickupCoordinates: { lat: number; lon: number },
  deliveryCoordinates: { lat: number; lon: number }
) => {
  if (!pickupCoordinates || !deliveryCoordinates) {
    return { pickup: null, delivery: null }
  }
  const pickupAddress = await helpers.getAddressFromCoordinate(
    pickupCoordinates
  )

  const deliveryAddress = await helpers.getAddressFromCoordinate(
    deliveryCoordinates
  )

  return {
    pickup: pickupAddress,
    delivery: deliveryAddress,
  }
}

const EditBooking = ({ bookings }: Props) => {
  const { bookingId } = useParams<{ bookingId: string }>()
  const booking = bookings.find((b) => b.id === bookingId)

  const [state, setState] = React.useState<typeof initialState>({
    ...initialState,
    externalId: booking?.externalId || '',
    sender: {
      ...initialState.sender,
      name: booking?.metadata.sender.name || '',
      contact: booking?.metadata.sender.contact || '',
    },
    recipient: {
      ...initialState.recipient,
      name: booking?.metadata.recipient.name || '',
      contact: booking?.metadata.recipient.contact || '',
    },
    fragile: !!booking?.metadata.fragile,
    cargo: booking?.metadata.cargo || '',
  })

  React.useEffect(() => {
    ;(async () => {
      if (!booking?.pickup || !booking?.delivery) {
        return
      }

      const { pickup, delivery } = await setAddressFromCoordinates(
        booking?.pickup,
        booking?.delivery
      )

      if (!pickup || !delivery) return

      setState((s) => ({
        ...s,
        pickup: { ...s.pickup, name: pickup.name, city: pickup?.county },
        delivery: {
          ...s.delivery,
          name: delivery.name,
          city: delivery.county,
        },
      }))
    })()
  }, [booking])

  const setUIState = stores.ui((state) => state.dispatch)
  const [formErrors, setFormErrors] = React.useState({
    pickup: false,
    delivery: false,
  })

  if (!booking)
    return (
      <p>
        Kunde inte hitta bokning med id: <b>{bookingId}</b>
      </p>
    )

  return (
    <MainRouteLayout redirect="/bookings">
      <Elements.Layout.Container>
        <h3>Lägg till bokning</h3>
        <Form
          setFormErrors={setFormErrors}
          formErrors={formErrors}
          onChangeHandler={setState}
          onSubmitHandler={() => {}}
          state={state}
          dispatch={setUIState}
          parcelSizePresets={parcelSizePresets}
        />
      </Elements.Layout.Container>
    </MainRouteLayout>
  )
}

export default EditBooking
