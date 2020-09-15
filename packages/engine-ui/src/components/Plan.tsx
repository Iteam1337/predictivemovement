import React from 'react'
import styled from 'styled-components'
import Elements from './Elements'
import { useRouteMatch, Route, Switch } from 'react-router-dom'
import SharedElements from '../shared-elements'
// import AddFormFieldButton from './forms/inputs/AddFormFieldButton'
// import CurrentPlan from './CurrentPlan'
import PlanRouteDetails from './PlanRouteDetails'

const PlanWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

// const StyledLink = styled(Link)`
//   align-self: flex-end;
// `

interface Address {
  lat: string
  lon: string
}

interface Activity {
  address: Address
  index: number
  type: string
}

interface AddressWithName extends Address {
  name: string
}

export interface IPlanVehicle {
  activities: Activity[]
  booking_ids: string[]
  busy: any
  capacity: any
  current_route: any
  earliest_start: Date
  end_address: AddressWithName
  id: string
  latest_end: Date
  metadata: any
  profile: any
  start_address: AddressWithName
}

interface IPlanProps {
  plan: IPlanVehicle[]
  dispatchOffers: () => void
}

const Plan = ({ plan: planVehicles, dispatchOffers }: IPlanProps) => {
  const activePlanVehicles = planVehicles.filter((d) => d.activities.length > 0)
  const { path } = useRouteMatch()

  return (
    <Switch>
      <Route exact path={[path, `${path}/routes/:routeId`]}>
        <PlanWrapper>
          <h3>Föreslagen plan</h3>
          {!activePlanVehicles.length ? (
            <Elements.NoInfoParagraph>
              Det finns inga föreslagna rutter...
            </Elements.NoInfoParagraph>
          ) : (
            <>
              {activePlanVehicles.map((vehicle, i) => (
                <PlanRouteDetails
                  key={i}
                  vehicle={vehicle}
                  routeNumber={i + 1}
                />
              ))}
              <SharedElements.Buttons.SubmitButton
                justifySelf="center"
                marginTop="20px"
                onClick={dispatchOffers}
              >
                Bekräfta plan
              </SharedElements.Buttons.SubmitButton>
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
