import React from 'react'
import Alert from '@material-ui/lab/Alert'
import Zoom from '@material-ui/core/Zoom'
import styled from 'styled-components'
import Elements from '../shared-elements'
import CheckIcon from '../assets/check-icon.svg'
import helpers from '../utils/helpers'
import * as notificationTypes from '../notificationTypes'

const Container = styled.div`
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

const getMessageFromNotification = ({
  event,
}: notificationTypes.Notification) => {
  switch (event.type) {
    case notificationTypes.Events.BOOKING:
      return notificationMessages['booking'](event.id)[event.event]
    case notificationTypes.Events.TRANSPORT:
      return notificationMessages['transport'](event.id)[event.event]
  }
}

const withClickableIdElement = (
  id: string,
  path: 'transports' | 'bookings'
) => (
  <Elements.Links.RoundedLink margin="0 0.5rem" to={`/${path}/${id}`}>
    {helpers.formatIdForEndUser(id)}
  </Elements.Links.RoundedLink>
)

const notificationMessages = {
  booking: (id: string) => ({
    new: (
      <>
        En ny bokning har lags till:
        {withClickableIdElement(id, 'bookings')}
      </>
    ),
    assigned: (
      <>
        Bokning {withClickableIdElement(id, 'bookings')} har blivit tilldelad en
        transport.
      </>
    ),
    delivered: (
      <>Bokning {withClickableIdElement(id, 'bookings')} har levererats.</>
    ),
    picked_up: (
      <>
        Bokning ${withClickableIdElement(id, 'bookings')} har hämtats upp av sin
        tilldelade transport.
      </>
    ),
    delivery_failed: (
      <>
        Bokning {withClickableIdElement(id, 'bookings')} kunde inte levereras.
      </>
    ),
  }),
  transport: (id: string) => ({
    new: (
      <>
        En ny transport har lags till:
        {withClickableIdElement(id, 'transports')}
      </>
    ),
  }),
}

const Notifications: React.FC<{
  notifications: notificationTypes.Notification[]
  updateNotifications: React.Dispatch<
    React.SetStateAction<notificationTypes.Notification[]>
  >
}> = ({ notifications, updateNotifications }) => {
  const handleOnClose = React.useCallback(
    (id: string) => {
      updateNotifications((notifications: notificationTypes.Notification[]) =>
        notifications.filter((notification) => notification.event.id !== id)
      )
    },
    [updateNotifications]
  )

  React.useEffect(() => {
    if (notifications.length > 0) {
      setTimeout(() => {
        handleOnClose(notifications[0].event.id)
      }, 20000)
    }
  }, [notifications, updateNotifications, handleOnClose])

  return (
    <Container>
      {notifications
        .map((notification, index) => {
          return (
            <Zoom in key={index}>
              <Alert
                icon={<img src={CheckIcon} alt={notification.severity} />}
                onClose={() => handleOnClose(notification.event.id)}
                key={notification.event.id}
                severity={notification.severity}
              >
                {getMessageFromNotification(notification)}
              </Alert>
            </Zoom>
          )
        })
        .reverse()}
    </Container>
  )
}

export default Notifications
