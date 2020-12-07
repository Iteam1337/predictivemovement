import React from 'react'
import { useParams } from 'react-router-dom'
import { Booking } from '../../types'
import MainRouteLayout from '../layout/MainRouteLayout'
import EditBooking from './EditBooking'
import Success from '../SuccessScreen'
import { useHistory } from 'react-router-dom'

interface Props {
  bookings: Booking[]
  updateBooking: (params: any) => void
}

const EditBookingRoute = ({ bookings, updateBooking }: Props) => {
  const history = useHistory()
  const { bookingId } = useParams<{ bookingId: string }>()
  const booking = bookings.find((b) => b.id === bookingId)
  const [isFinished, setIsFinished] = React.useState(false)

  const handleOnClose = () => history.push('/bookings')

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
      ) : (
        <EditBooking
          booking={booking}
          updateBooking={updateBooking}
          setIsFinished={setIsFinished}
        />
      )}
    </MainRouteLayout>
  )
}

export default EditBookingRoute
