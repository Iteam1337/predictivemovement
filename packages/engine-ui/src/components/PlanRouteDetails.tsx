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
import MoveMenu from './MoveMenu'

interface Props {
  color?: InAppColor
  route: Route
  routeNumber: number
  transports: Route[]
  moveBooking: (bookingId: string, transportId: string) => void
  onToggleMinimize: () => void
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
  padding: 0;
`

const BookingListItem = styled.li`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.7rem;
  margin-left: 1rem;
`

const PlanRouteDetails = ({
  route,
  routeNumber,
  transports,
  color,
  moveBooking,
  onToggleMinimize,
}: Props) => {
  const setUIState = stores.ui((state) => state.dispatch)
  const setMap = stores.map((state) => state.set)
  const history = useHistory()
  const { routeId } = useParams<{ routeId: string | undefined }>()
  const isCurrentPlan = useRouteMatch({ path: ['/plans/current-plan'] })
  const setMapLayers = stores.mapLayerState((state) => state.set)

  React.useEffect(() => {
    if (routeId) {
      setMapLayers({ type: 'planRouteDetails', payload: { routeId } })
    }
  }, [setMapLayers, routeId])

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
    if (!route.activities) return route.startAddress
    return calculateCenter(route.activities)
  }

  const toggle = (id: string) => {
    if (id === routeId) {
      onToggleMinimize()
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
                panMapView(route.startAddress.lat, route.startAddress.lon)
              }
            >
              {route.metadata?.profile?.toUpperCase() ||
                helpers.getLastFourChars(route.id).toUpperCase()}
            </Elements.Links.RoundedLink>
          </Elements.Layout.FlexRowWrapper>
          Bookingar på rutt:
          <BookingsList>
            {route.bookingIds?.map((bookingId) => (
              <BookingListItem key={bookingId}>
                <Elements.Links.RoundedLink to={`/bookings/${bookingId}`}>
                  {helpers.getLastFourChars(bookingId).toUpperCase()}
                </Elements.Links.RoundedLink>
                <MoveMenu
                  transports={transports}
                  bookingId={bookingId}
                  currentTransportId={route.id}
                  moveBooking={moveBooking}
                />
              </BookingListItem>
            ))}
          </BookingsList>
          <RouteActivities route={route} />
        </>
      )}
    </>
  )
}

export default PlanRouteDetails
