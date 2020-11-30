import React from 'react'

import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import styled from 'styled-components'
import * as helpers from '../utils/helpers'
import { Route } from '../types'

const MenuButton = styled.button`
  font-size: 0.75rem;
  background: none;
  border: none;
  outline: none;
  font-weight: bold;
  padding: 0;
  cursor: pointer;
  padding: 0.75rem 1rem;
  background-color: aliceblue;
  border-radius: 0.75rem;
`

interface props {
  bookingId: string
  transports: Route[]
  currentTransportId: string
  moveBooking: (bookingId: string, transportId: string) => void
}

const MoveMenu = ({
  bookingId,
  transports,
  currentTransportId,
  moveBooking,
}: props) => {
  const [menuIsOpen, toggleMenu] = React.useState(false)
  const menuEl = React.useRef(null)

  if (transports.length === 1 && transports[0].id === currentTransportId) {
    return null
  }

  return (
    <>
      <MenuButton onClick={() => toggleMenu((isOpen) => !isOpen)} ref={menuEl}>
        Flytta bokning
      </MenuButton>
      <Menu
        open={menuIsOpen}
        anchorEl={menuEl.current}
        onClose={() => toggleMenu((isOpen) => !isOpen)}
      >
        {transports.map(({ id, metadata }) => (
          <MenuItem
            key={id}
            disabled={id === currentTransportId}
            selected={currentTransportId === id}
            onClick={() => {
              toggleMenu((isOpen) => !isOpen)
              moveBooking(bookingId, id)
            }}
          >
            {metadata?.profile?.toUpperCase() ||
              helpers.getLastFourChars(id).toUpperCase()}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default MoveMenu
