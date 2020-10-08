import React from 'react'
import Alert from '@material-ui/lab/Alert'
import Zoom from '@material-ui/core/Zoom'
import styled from 'styled-components'
import Elements from '../shared-elements'
import { Booking, NotificationType, Transport } from '../types'
import CheckIcon from '../assets/check-icon.svg'

const NotificationsContainer = styled.div`
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

const BookingNotification: React.FC<{
  booking: Booking
  handleOnClose: (value: string) => void
}> = ({ booking, handleOnClose }) => (
  <Zoom in={Boolean(booking)}>
    <Alert
      icon={<img src={CheckIcon} alt="Success" />}
      onClose={() => handleOnClose(booking.id)}
      key={booking.id}
      severity="success"
    >
      En ny bokning har lags till
      <Elements.Links.RoundedLink
        margin="0 0.5rem"
        to={`/bookings/${booking.id}`}
      >
        {booking.id}
      </Elements.Links.RoundedLink>
    </Alert>
  </Zoom>
)

const VehicleNotification: React.FC<{
  vehicle: Transport
  handleOnClose: (value: string) => void
}> = ({ vehicle, handleOnClose }) => (
  <Zoom in={Boolean(vehicle)}>
    <Alert
      icon={<img src={CheckIcon} alt="Success" />}
      onClose={() => handleOnClose(vehicle.id)}
      key={vehicle.id}
      severity="success"
    >
      En ny transport har lags till
      <Elements.Links.RoundedLink
        margin="0 0.5rem"
        to={`/transports/${vehicle.id}`}
      >
        {vehicle.id}
      </Elements.Links.RoundedLink>
    </Alert>
  </Zoom>
)

const Notifications: React.FC<{
  notifications: NotificationType[]
  updateNotifications: (value: any) => void
}> = ({ notifications, updateNotifications }) => {
  const handleOnClose = React.useCallback(
    (itemId: string) => {
      updateNotifications((notifications: NotificationType[]) =>
        notifications.filter((notification) => notification.id !== itemId)
      )
    },
    [updateNotifications]
  )

  React.useEffect(() => {
    if (notifications.length > 0) {
      setTimeout(() => {
        handleOnClose(notifications[0].id)
      }, 20000)
    }
  }, [notifications, updateNotifications, handleOnClose])

  const notificationType = (notification: NotificationType) => {
    switch (notification.id.substr(0, 3)) {
      case 'pmv':
        if ((notification as Transport).booking_ids === null)
          return (
            <VehicleNotification
              key={notification.id}
              handleOnClose={handleOnClose}
              vehicle={notification as Transport}
            />
          )
        break
      case 'pmb':
        if ((notification as Booking).status === 'new')
          return (
            <BookingNotification
              key={notification.id}
              handleOnClose={handleOnClose}
              booking={notification as Booking}
            />
          )
        break
      default:
        return
    }
  }

  return (
    <NotificationsContainer>
      {notifications
        .map((notification) => notificationType(notification))
        .reverse()}
    </NotificationsContainer>
  )
}

export default Notifications
