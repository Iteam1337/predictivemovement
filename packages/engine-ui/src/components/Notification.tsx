import React from 'react'
import Alert from '@material-ui/lab/Alert'
import Zoom from '@material-ui/core/Zoom'
import { Notification } from '../types/notification'
import styled from 'styled-components'

const StyledAlert = styled(Alert)`
  align-items: center;
`

const Component: React.FC<{
  notification: Notification
  handleOnClose: (id: string) => void
}> = ({ notification: { severity, event }, children, handleOnClose }) => (
  <Zoom in={true}>
    <StyledAlert
      style={{ alignItems: 'center' }}
      onClose={() => handleOnClose(event.id)}
      key={event.id}
      severity={severity}
    >
      {children}
    </StyledAlert>
  </Zoom>
)

export default Component
