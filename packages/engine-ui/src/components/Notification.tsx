import React from 'react'
import { Alert } from '@material-ui/lab'
import { Notification } from '../notificationTypes'
import CheckIcon from '../assets/check-icon.svg'

const Component: React.FC<
  { notification: Notification } & { handleOnClose: (id: string) => void }
> = ({ notification: { severity, event }, children, handleOnClose }) => {
  return (
    <Alert
      icon={<img src={CheckIcon} alt={severity} />}
      onClose={() => handleOnClose(event.id)}
      key={event.id}
      severity={severity}
    >
      {children}
    </Alert>
  )
}

export default Component
