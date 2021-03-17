import React from 'react'
import styled from 'styled-components'
import * as Icons from '../assets/Icons'
import * as Elements from '../shared-elements'

const Container = styled.div`
  width: 304px;
  display: flex;
  align-items: center;
  flex-flow: column nowrap;
  margin-top: 20vh;
  text-align: center;

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
  onClose?: () => void
  onContinue?: () => void
  closeButtonText?: string
}> = ({ onClose, onContinue, infoText, closeButtonText = 'Stäng' }) => {
  const [state, set] = React.useState(false)

  React.useEffect(() => {
    const timeout = window.setTimeout(() => set(true), 100)

    return () => window.clearTimeout(timeout)
  }, [])

  return (
    <Container>
      <ImageContainer active={state}>
        <Icons.ThumbsUp />
      </ImageContainer>
      <Elements.Layout.MarginTopContainerSm>
        <h3>{infoText}</h3>
      </Elements.Layout.MarginTopContainerSm>
      <Elements.Layout.MarginTopContainer>
        <Elements.Layout.ButtonWrapper>
          {onClose && (
            <Elements.Buttons.CancelButton onClick={onClose}>
              {closeButtonText}
            </Elements.Buttons.CancelButton>
          )}

          {onContinue && (
            <Elements.Buttons.SubmitButton
              onClick={onContinue}
              type="button"
              padding="0.75rem 1.25rem"
            >
              Lägg till ny
            </Elements.Buttons.SubmitButton>
          )}
        </Elements.Layout.ButtonWrapper>
      </Elements.Layout.MarginTopContainer>
    </Container>
  )
}

export default Component
