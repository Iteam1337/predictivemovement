import React from 'react'
import { Transition } from 'react-transition-group'
import styled from 'styled-components'

const Animation = styled.div`
  transition: opacity 500ms, transform 500ms;
  width: inherit;
  opacity: ${({ state }) => (state === 'entered' ? 1 : 0)};
  transform: ${({ state }) =>
    state === 'entered' ? 'translateY(0)' : 'translateY(20%)'};
`

const OpacityFadeInAnim = ({ animate, children }) => {
  return (
    <div>
      <Transition timeout={0} in={animate}>
        {(state) => <Animation state={state}>{children}</Animation>}
      </Transition>
    </div>
  )
}

export default OpacityFadeInAnim
