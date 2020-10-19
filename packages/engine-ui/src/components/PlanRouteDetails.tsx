import React from 'react'
import styled from 'styled-components'
import { FlyToInterpolator } from 'react-map-gl'
import RouteActivities from './RouteActivities'
import Icons from '../assets/Icons'
import { useHistory, useParams, useRouteMatch } from 'react-router-dom'
import Elements from '../shared-elements'
import helpers from '../utils/helpers'
import { Route, InAppColor } from '../types'
import stores from '../utils/state/stores'

interface Props {
  route: Route
  color?: InAppColor
  routeNumber: number
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

const PlanRouteDetails = ({ route, routeNumber, color }: Props) => {
  const setUIState = stores.ui((state) => state.dispatch)
  const setMap = stores.map((state) => state.set)
  const history = useHistory()
  const { routeId } = useParams<{ routeId: string | undefined }>()
  const isCurrentPlan = useRouteMatch({ path: ['/plans/current-plan'] })

  const toggle = (id: string) => {
    if (id === routeId) {
      return history.push(isCurrentPlan ? '/plans/current-plan' : '/plans')
    }

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
                setMap({
                  latitude: route.start_address.lat,
                  longitude: route.start_address.lon,
                  zoom: 10,
                  transitionDuration: 3000,
                  transitionInterpolator: new FlyToInterpolator(),
                  transitionEasing: (t: number) => t * (2 - t),
                })
              }
            >
              {helpers.getLastFourChars(route.id).toUpperCase()}
            </Elements.Links.RoundedLink>
          </Elements.Layout.FlexRowWrapper>
          <RouteActivities route={route} />
        </>
      )}
    </>
  )
}

export default PlanRouteDetails
