import React from 'react'

import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import styled from 'styled-components'
import * as helpers from '../utils/helpers'
import { Route } from '../types'

const MenuButton = styled.button``

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

  return (
    <>
      <MenuButton onClick={() => toggleMenu((isOpen) => !isOpen)} ref={menuEl}>
        Flytta
      </MenuButton>
      <Menu
        open={menuIsOpen}
        anchorEl={menuEl.current}
        onClose={() => toggleMenu((isOpen) => !isOpen)}
      >
        {transports.map(({ id }) => (
          <MenuItem
            key={id}
            selected={currentTransportId === id}
            onClick={() => {
              toggleMenu((isOpen) => !isOpen)
              moveBooking(bookingId, id)
            }}
          >
            {helpers.getLastFourChars(id).toUpperCase()}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default MoveMenu
