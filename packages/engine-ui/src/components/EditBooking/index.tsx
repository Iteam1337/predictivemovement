import React from 'react'
import styled from 'styled-components'

import { useParams } from 'react-router-dom'
import * as types from '../../types'
import MainRouteLayout from '../layout/MainRouteLayout'
import EditBooking from './EditBooking'
import Success from '../SuccessScreen'
import { useHistory } from 'react-router-dom'
import { getAddressFromCoordinate } from '../../utils/helpers'

interface Props {
  bookings: types.Booking[]
  updateBooking: (params: any) => void
}
const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const EditBookingRoute = ({ bookings, updateBooking }: Props) => {
  const history = useHistory()
  const { bookingId } = useParams<{ bookingId: string }>()
  const booking = bookings.find((b) => b.id === bookingId)
  const [isFinished, setIsFinished] = React.useState(false)
  const handleOnClose = () => history.push('/bookings')
  const [loading, setLoading] = React.useState(true)
  const [address, setAddress] = React.useState({ pickup: {}, delivery: {} })

  React.useEffect(() => {
    const setAddressFromCoordinates = async (
      pickupCoordinates: types.Booking['pickup'],
      deliveryCoordinates: types.Booking['delivery']
    ) => {
      const pickupAddress = await getAddressFromCoordinate(pickupCoordinates)
      const deliveryAddress = await getAddressFromCoordinate(
        deliveryCoordinates
      )

      setAddress({
        pickup: {
          name: `${pickupAddress.name}, ${pickupAddress.county}`,
          street: pickupAddress.name,
          city: pickupAddress.county,
        },
        delivery: {
          name: `${deliveryAddress.name}, ${deliveryAddress.county}`,
          street: deliveryAddress.name,
          city: deliveryAddress.county,
        },
      })

      setLoading(false)
    }

    if (!booking) return
    setAddressFromCoordinates(booking.pickup, booking.delivery)
  }, [booking])

  if (isFinished)
    return (
      <Success onClose={handleOnClose} infoText="Bokningen är uppdaterad!" />
    )

  return (
    <MainRouteLayout redirect="/bookings">
      {!booking ? (
        <p>
          Kunde inte hitta bokning med id: <b>{bookingId}</b>
        </p>
      ) : loading ? (
        <LoadingWrapper>
          <p>Laddar...</p>
        </LoadingWrapper>
      ) : (
        <EditBooking
          booking={{
            ...booking,
            pickup: {
              ...address.pickup,
              ...booking.pickup,
            },
            delivery: {
              ...address.delivery,
              ...booking.delivery,
            },
          }}
          updateBooking={updateBooking}
          setIsFinished={setIsFinished}
        />
      )}
    </MainRouteLayout>
  )
}

export default EditBookingRoute
