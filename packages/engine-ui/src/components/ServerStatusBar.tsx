import React from 'react'
import styled from 'styled-components'
import Plug from '../assets/plug.svg'
import * as Elements from '../shared-elements'
const ServerStatusBar = styled.div<{ status: string }>`
  position: absolute;
  display: ${({ status }) => (status !== 'ok' ? 'flex' : 'none')};
  z-index: 99;
  width: 100vw;
  background: #ffcdcd;
  justify-content: center;
  color: #666666;
  padding: 4px;
  font-weight: bold;
  font-size: 11pt;
`

const ServerStatusScreen = styled.div<{ status: string }>`
  width: 100vw;
  height: 100vh;
  z-index: 99;
  position: absolute;
  background: #ffcdcd;
  display: ${({ status }) => (status !== 'ok' ? 'flex' : 'none')};
  flex-direction: column;
  margin: auto;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
`

const Component: React.FC<{ serverStatus: { status: string } }> = ({
  serverStatus,
}) => {
  const isMobile = window.innerWidth <= 645

  return isMobile ? (
    <ServerStatusScreen status={serverStatus.status}>
      <img src={Plug} alt="kontakt" />
      <h3>Det verkar inte gå att nå plattformen just nu.</h3>
      <Elements.Typography.CleanH3>
        Vänligen kontrollera att du är ansluten mot internet och försök igen.
      </Elements.Typography.CleanH3>
    </ServerStatusScreen>
  ) : (
    <ServerStatusBar status={serverStatus.status}>
      Can't connect to the server, please try again later...
    </ServerStatusBar>
  )
}

export default Component
