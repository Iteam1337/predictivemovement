import React from 'react'
import styled from 'styled-components'
import * as Icons from '../assets/Icons'
import * as Elements from '../styles'

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-flow: column nowrap;
  text-align: center;
  padding: 1rem;

  div {
    gap: 10px;
  }
`

const ImageContainer = styled.div<{ active: boolean }>`
  transform: ${({ active }) => (active ? 'scale(1)' : 'scale(0)')};
  transition: transform 300ms cubic-bezier(0.36, 0.28, 0.56, 1.3);
`

const Component: React.FC<{
  infoText: string
}> = ({ infoText }) => {
  const [state, set] = React.useState(false)

  React.useEffect(() => {
    const timeout = window.setTimeout(() => set(true), 100)

    return () => window.clearTimeout(timeout)
  }, [])

  return (
    <Container>
      <Elements.MarginTopContainerSm>
        <h3>{infoText}</h3>
      </Elements.MarginTopContainerSm>
      <ImageContainer active={state}>
        <Icons.ThumbsUp />
      </ImageContainer>
    </Container>
  )
}

export default Component
