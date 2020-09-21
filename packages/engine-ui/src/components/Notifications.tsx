import React from 'react'
import Alert from '@material-ui/lab/Alert'
import Zoom from '@material-ui/core/Zoom'
import styled from 'styled-components'
import Elements from '../shared-elements'

const NotificationsContaioner = styled.div`
  width: 25%;
  position: absolute;
  z-index: 30;
  bottom: 0;
  right: 0;
  margin: 2rem 2rem;

  & > * + * {
    margin-top: 2rem;
  }

  > div {
    display: flex;
    align-items: center;
    background-color: white;
    border: 1px solid grey;
  }
`

enum BookingStatus {
  NEW = 'new',
  ASSIGNED = 'assigned',
  DELIVERED = 'delivered',
  PICKED_UP = 'picked_up',
}

type Booking = {
  id: string
  pickup: {
    lat: string
    lon: string
  }
  delivery: {
    lat: string
    lon: string
  }
  status: BookingStatus
}

const BookingNotification: React.FC<{
  booking: any
  handleOnClose: (value: string) => void
}> = ({ booking, handleOnClose }) => (
  <Zoom in={booking}>
    <Alert
      onClose={() => handleOnClose(booking.id)}
      key={booking.id}
      severity="success"
    >
      New booking was succesfully added
      <Elements.Links.RoundedLink
        margin="0 1rem"
        to={`/bookings/${booking.id}`}
      >
        {booking.id}
      </Elements.Links.RoundedLink>
    </Alert>
  </Zoom>
)

const VehicleNotification: React.FC<{
  vehicle: any
  handleOnClose: (value: string) => void
}> = ({ vehicle, handleOnClose }) => {
  return (
    <Alert
      onClose={() => handleOnClose(vehicle.id)}
      key={vehicle.id}
      severity="success"
    >
      New vehicle was succesfully added
      <Elements.Links.RoundedLink
        margin="0 1rem"
        to={`/transports/${vehicle.id}`}
      >
        {vehicle.id}
      </Elements.Links.RoundedLink>
    </Alert>
  )
}

const Notifications: React.FC<{
  notifications: []
  updateNotifications: (value: any) => void
}> = ({ notifications, updateNotifications }) => {
  const notificationType = (notification: any) => {
    switch (true) {
      case notification.id.includes('pmv-'):
        return (
          <VehicleNotification
            key={notification.id}
            handleOnClose={handleOnClose}
            vehicle={notification}
          />
        )

      case notification.id.includes('pmb-'):
        return (
          <BookingNotification
            key={notification.id}
            handleOnClose={handleOnClose}
            booking={notification}
          />
        )

      default:
        break
    }
  }

  const handleOnClose = (itemId: string) => {
    updateNotifications((notifications: any) =>
      notifications.filter((notification: any) => notification.id !== itemId)
    )
  }

  return (
    <NotificationsContaioner>
      {notifications &&
        notifications
          .map((notification) => notificationType(notification))

          .reverse()}
    </NotificationsContaioner>
  )
}

export default Notifications
