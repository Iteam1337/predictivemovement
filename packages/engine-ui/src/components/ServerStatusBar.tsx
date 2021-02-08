import React from 'react'
import styled from 'styled-components'
const ServerStatusBar = styled.div<{ status: string }>`
  position: absolute;
  display: ${({ status }) => (status !== 'ok' ? 'flex' : 'none')};
  z-index: 99;
  width: 100vw;
  background: #ff9999;
  justify-content: center;
  color: black;
  padding: 4px;
  font-weight: bold;
  font-size: 11pt;
`

const Component: React.FC<{ serviceDisruption: string }> = ({
  serviceDisruption,
}) => {
  return (
    <ServerStatusBar status={serviceDisruption}>
      Can't connect to the server, please try again later...
    </ServerStatusBar>
  )
}

export default Component
