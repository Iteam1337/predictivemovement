import React from 'react'
import styled from 'styled-components'
import Image from '../assets/thumbs-up.svg'

const Container = styled.div``

const Component: React.FC<{ onClose: () => void; onContinue: () => void }> = ({
  onClose,
  onContinue,
}) => {
  return (
    <Container>
      <img src={Image} alt="Tumme upp" />
    </Container>
  )
}

export default Component
