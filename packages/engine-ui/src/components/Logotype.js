import React from 'react'
import styled from 'styled-components'
import Logo from '../assets/logo.svg'

const LogoImg = styled.img`
  z-index: 10;
  position: absolute;
  right: 0;
  margin: 3rem;
`

const Logotype = () => {
  return <LogoImg src={Logo} alt="predictive movement logo" />
}

export default Logotype
