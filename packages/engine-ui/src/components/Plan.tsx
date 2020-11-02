import React from 'react'
import styled from 'styled-components'
import { useRouteMatch, Route, Switch } from 'react-router-dom'
import Elements from '../shared-elements'
import PlanRouteDetails from './PlanRouteDetails'
import PlanBookingDetails from './PlanBookingDetails'
import { Route as PlanRoute, Transport, Booking } from '../types'
import stores from '../utils/state/stores'
import NotFound from './NotFound'

const PlanWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

interface IPlanProps {
  plan: PlanRoute[]
  transports: Transport[]
  dispatchOffers: (params: any) => void
  bookings: Booking[]
}

const Plan = ({
  plan: routes,
  dispatchOffers,
  transports,
  bookings,
}: IPlanProps) => {
  const activeRoutes = routes.filter(
    (d) => d.activities && d.activities.length > 0
  )
  const { path } = useRouteMatch()
  const setUIState = stores.ui((state) => state.dispatch)

  return (
    <Switch>
      <Route exact path={[path, `${path}/routes/:routeId`]}>
        <PlanWrapper>
          <h3>Föreslagen plan</h3>
          {!activeRoutes.length ? (
            <Elements.Typography.NoInfoParagraph>
              Det finns inga föreslagna rutter...
            </Elements.Typography.NoInfoParagraph>
          ) : (
            <>
              {activeRoutes.map((route, i) => (
                <PlanRouteDetails
                  key={i}
                  route={route}
                  routeNumber={i + 1}
                  color={
                    transports.find((transport) => transport.id === route.id)
                      ?.color
                  }
                />
              ))}
              <Elements.Buttons.SubmitButton
                alignSelf="center"
                marginTop="5rem"
                onClick={dispatchOffers}
              >
                Bekräfta plan
              </Elements.Buttons.SubmitButton>
            </>
          )}
        </PlanWrapper>
      </Route>
      <Route exact path={`${path}/routes/:routeId/:activityId`}>
        <PlanBookingDetails
          bookings={bookings}
          onUnmount={() =>
            setUIState({ type: 'highlightBooking', payload: undefined })
          }
        />
      </Route>
      <Route
        exact
        path={[`${path}/current-plan`, `${path}/current-plan/:routeId`]}
      />
      <Route component={NotFound} />
    </Switch>
  )
}

export default Plan
