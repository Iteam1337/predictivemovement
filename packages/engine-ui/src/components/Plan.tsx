import React from 'react'
import styled from 'styled-components'
import Elements from './Elements'
import { useRouteMatch, Route, Switch } from 'react-router-dom'
import SharedElements from '../shared-elements'
// import AddFormFieldButton from './forms/inputs/AddFormFieldButton'
// import CurrentPlan from './CurrentPlan'
import PlanRouteDetails from './PlanRouteDetails'
import { PlanVehicle } from '../types'

const PlanWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

interface IPlanProps {
  plan: PlanVehicle[]
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
                alignSelf="center"
                marginTop="4rem"
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
