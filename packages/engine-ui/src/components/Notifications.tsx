import React from 'react'
import styled from 'styled-components'
import * as Elements from '../shared-elements'
import * as helpers from '../utils/helpers'
import * as stores from '../utils/state/stores'
import shallow from 'zustand/shallow'
import {
  Notification,
  EntityType,
  BookingStatus,
  TransportStatus,
} from '../types/notification'
import NotificationComponent from './Notification'

const Container = styled.div`
  position: absolute;
  z-index: 30;
  bottom: 0;
  right: 0;
  margin: 2rem 2rem;

  > div {
    margin-top: 1rem;
    display: flex;
    align-items: center;
    background-color: white;
    border: 1px solid grey;
  }
`

const notificationMessages = {
  [EntityType.BOOKING]: {
    [BookingStatus.NEW]: 'En ny bokning har lags till:',
    [BookingStatus.ASSIGNED]: 'En bokning har tilldelats transport:',
    [BookingStatus.DELIVERED]: 'En bokning har levererats:',
    [BookingStatus.PICKED_UP]:
      'En bokning har hämtats upp av sin tilldelade transport:',
    [BookingStatus.DELIVERY_FAILED]: 'En bokning kunde inte levereras:',
  },
  [EntityType.TRANSPORT]: {
    [TransportStatus.NEW]: 'En ny transport har lags till:',
    [TransportStatus.NEW_INSTRUCTIONS]: 'En ny rutt har bekräftats:',
    [TransportStatus.LOGIN]: 'En förare har loggat in:',
    [TransportStatus.FINISHED]: 'En transport har slutfört sin rutt:',
  },
}

const messageElementFromNotification = (notification: Notification) => {
  switch (notification.type) {
    case EntityType.BOOKING:
      return notificationMessages[EntityType.BOOKING][notification.event.status]
    case EntityType.TRANSPORT:
      return notificationMessages[EntityType.TRANSPORT][
        notification.event.status
      ]
  }
}

const Notifications: React.FC = () => {
  const [notifications, removeOneById] = stores.notifications(
    React.useCallback(
      (state) => [state.notifications, state.deleteOneById],
      []
    ),
    shallow
  )

  const handleOnClose = React.useCallback(
    (id: string) => {
      removeOneById(id)
    },
    [removeOneById]
  )

  React.useEffect(() => {
    if (notifications.length) {
      setTimeout(() => {
        handleOnClose(notifications[0].event.id)
      }, 20000)
    }
  }, [notifications, handleOnClose])

  const withLinkElement = (
    id: string,
    entityType: EntityType,
    text: string,
    name?: string
  ) => {
    const path = entityType === EntityType.BOOKING ? 'bookings' : 'transports'
    return (
      <>
        {text}
        <Elements.Links.RoundedLink margin="0 0.5rem" to={`/${path}/${id}`}>
          {name || helpers.formatIdForEndUser(id)}
        </Elements.Links.RoundedLink>
      </>
    )
  }

  return (
    <Container>
      {notifications.map((notification, index) => (
        <NotificationComponent
          key={index}
          notification={notification}
          handleOnClose={() => handleOnClose(notification.event.id)}
        >
          {withLinkElement(
            notification.event.id,
            notification.type,
            messageElementFromNotification(notification),
            notification.type === EntityType.TRANSPORT
              ? notification.transportName
              : undefined
          )}
        </NotificationComponent>
      ))}
    </Container>
  )
}

export default Notifications
