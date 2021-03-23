import React from 'react'
import { Transition } from 'react-transition-group'
import styled from 'styled-components'

const Animation = styled.div`
  transition: opacity 800ms, transform 500ms;
  width: inherit;
  opacity: ${({ state }) => (state === 'entered' ? 1 : 0)};
  transform: ${({ state }) =>
    state === 'entered' ? 'translateY(0)' : 'translateY(500%)'};
`

const AnimateItem = ({ animate, children }) => {
  return (
    <div>
      <Transition timeout={0} in={animate}>
        {(state) => {
          return <Animation state={state}>{children}</Animation>
        }}
      </Transition>
    </div>
  )
}

export default AnimateItem
