import React from 'react'
import styled from 'styled-components'
import { useRouteMatch, Route, Switch } from 'react-router-dom'
import Elements from '../shared-elements'
// import AddFormFieldButton from './forms/inputs/AddFormFieldButton'
// import CurrentPlan from './CurrentPlan'
import PlanRouteDetails from './PlanRouteDetails'
import { Booking, PlanVehicle } from '../types'
import PlanBookingDetails from './PlanBookingDetails'

const PlanWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

interface IPlanProps {
  plan: PlanVehicle[]
  dispatchOffers: () => void
  bookings: Booking[]
}

const Plan = ({ plan: planVehicles, dispatchOffers, bookings }: IPlanProps) => {
  const activePlanVehicles = planVehicles.filter((d) => d.activities.length > 0)
  const { path } = useRouteMatch()
  return (
    <Switch>
      <Route exact path={[path, `${path}/routes/:routeId`]}>
        <PlanWrapper>
          <h3>Föreslagen plan</h3>
          {!activePlanVehicles.length ? (
            <Elements.Typography.NoInfoParagraph>
              Det finns inga föreslagna rutter...
            </Elements.Typography.NoInfoParagraph>
          ) : (
            <>
              {activePlanVehicles.map((vehicle, i) => (
                <PlanRouteDetails
                  key={i}
                  vehicle={vehicle}
                  routeNumber={i + 1}
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
          {/* Disabled as we cannot see current plan yet. */}
          {/* <StyledLink to={`${path}/current-plan`}>
            <AddFormFieldButton onClickHandler={null}>
              Aktuell plan
            </AddFormFieldButton>
          </StyledLink> */}
        </PlanWrapper>
      </Route>
      <Route exact path={`${path}/routes/:routeId/booking/:bookingId`}>
        <PlanBookingDetails plan={planVehicles} bookings={bookings} />
      </Route>
      <Route
        exact
        path={[`${path}/current-plan`, `${path}/current-plan/:routeId`]}
      >
        {/* <CurrentPlan plan={planVehicles} /> */}
      </Route>
    </Switch>
  )
}

export default Plan
