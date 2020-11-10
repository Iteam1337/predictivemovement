import React from 'react'
import styled from 'styled-components'
import { FlyToInterpolator } from 'react-map-gl'
import RouteActivities from './RouteActivities'
import * as Icons from '../assets/Icons'
import { useHistory, useParams, useRouteMatch } from 'react-router-dom'
import * as Elements from '../shared-elements'
import * as helpers from '../utils/helpers'
import { Route, InAppColor, Activity } from '../types'
import * as stores from '../utils/state/stores'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

interface Props {
  color?: InAppColor
  route: Route
  routeNumber: number
  transports: Route[]
  moveBooking: (bookingId: string, routeId: string) => void
}

const RouteTitleWrapper = styled.div`
  display: grid;
  grid-template-columns: 50% 1fr;
  align-items: baseline;
  justify-items: flex-start;
  width: 100%;
`

const Chevron = styled(Icons.Arrow)`
  transform: ${({ active }) => active && `rotate(180deg)`};
  transition: transform 0.2s;
  justify-self: flex-end;
`

const BookingsList = styled.ul`
  list-style: none;
`

const MenuButton = styled.button``

const PlanRouteDetails = ({
  route,
  routeNumber,
  transports,
  color,
  moveBooking,
}: Props) => {
  const setUIState = stores.ui((state) => state.dispatch)
  const setMap = stores.map((state) => state.set)
  const history = useHistory()
  const { routeId } = useParams<{ routeId: string | undefined }>()
  const isCurrentPlan = useRouteMatch({ path: ['/plans/current-plan'] })
  const menuEl = React.useRef(null)
  const [changeRouteMenuOpen, toggleRouteMenu] = React.useState(false)

  const panMapView = (latitude: number, longitude: number) =>
    setMap({
      latitude,
      longitude,
      zoom: 10,
      transitionDuration: 3000,
      transitionInterpolator: new FlyToInterpolator(),
      transitionEasing: (t: number) => t * (2 - t),
    })
  const calculateCenter = (activities: Activity[]) => {
    const coordinates = activities.reduce<{ lat: number; lon: number }>(
      (prev, curr) => ({
        lat: prev.lat + curr.address.lat,
        lon: prev.lon + curr.address.lon,
      }),
      { lat: 0, lon: 0 }
    )

    return {
      lat: coordinates.lat / activities.length,
      lon: coordinates.lon / activities.length,
    }
  }

  const getMapCoordinates = () => {
    if (!route.activities) return route.start_address
    return calculateCenter(route.activities)
  }

  const toggle = (id: string) => {
    if (id === routeId) {
      return history.push(isCurrentPlan ? '/plans/current-plan' : '/plans')
    }

    const { lat, lon } = getMapCoordinates()
    panMapView(lat, lon)

    return history.push(
      isCurrentPlan ? `/plans/current-plan/${id}` : `/plans/routes/${id}`
    )
  }

  return (
    <>
      <RouteTitleWrapper
        onClick={() => {
          toggle(route.id)
        }}
      >
        <Elements.Typography.StrongParagraph dotColor={color}>
          Rutt {routeNumber}
        </Elements.Typography.StrongParagraph>
        <Chevron active={routeId === route.id ? true : undefined} />
      </RouteTitleWrapper>
      {routeId === route.id && (
        <>
          <Elements.Layout.FlexRowWrapper>
            <Elements.Typography.StrongParagraph>
              Transport
            </Elements.Typography.StrongParagraph>
            <Elements.Links.RoundedLink
              color={color}
              margin="0 0.5rem"
              onMouseOver={() =>
                setUIState({ type: 'highlightTransport', payload: route.id })
              }
              onMouseLeave={() =>
                setUIState({ type: 'highlightTransport', payload: undefined })
              }
              to={`/transports/${route.id}`}
              onClick={() =>
                panMapView(route.start_address.lat, route.start_address.lon)
              }
            >
              {helpers.getLastFourChars(route.id).toUpperCase()}
            </Elements.Links.RoundedLink>
          </Elements.Layout.FlexRowWrapper>
          <BookingsList>
            {route.booking_ids?.map((bookingId) => (
              <li key={bookingId}>
                <Elements.Links.RoundedLink to={`/bookings/${route.id}`}>
                  {helpers.getLastFourChars(bookingId).toUpperCase()}
                </Elements.Links.RoundedLink>
                <MenuButton
                  onClick={() => toggleRouteMenu((isOpen) => !isOpen)}
                  ref={menuEl}
                >
                  Flytta
                </MenuButton>
                <Menu
                  open={changeRouteMenuOpen}
                  anchorEl={menuEl.current}
                  onClose={() => toggleRouteMenu((isOpen) => !isOpen)}
                >
                  {transports.map(({ id }) => (
                    <MenuItem
                      key={id}
                      selected={route.id === id}
                      onClick={() => {
                        toggleRouteMenu((isOpen) => !isOpen)
                        moveBooking(bookingId, id)
                      }}
                    >
                      {helpers.getLastFourChars(id).toUpperCase()}
                    </MenuItem>
                  ))}
                </Menu>
              </li>
            ))}
          </BookingsList>
          <RouteActivities route={route} />
        </>
      )}
    </>
  )
}

export default PlanRouteDetails
