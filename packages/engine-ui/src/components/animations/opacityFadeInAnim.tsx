import React from 'react'
import { Transition } from 'react-transition-group'
import styled from 'styled-components'

const Animation = styled.div<{ state: string }>`
  transition: opacity 500ms, transform 500ms;
  opacity: ${({ state }) => (state === 'entered' ? 1 : 0)};
`

const OpacityFadeInAnim: React.FC<{ animate: boolean }> = ({
  animate,
  children,
}) => {
  return (
    <Transition timeout={0} in={animate}>
      {(state) => <Animation state={state}>{children}</Animation>}
    </Transition>
  )
}

export default OpacityFadeInAnim
