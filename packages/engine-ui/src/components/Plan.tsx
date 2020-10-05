import React from 'react'
import styled from 'styled-components'
import { useRouteMatch, Route, Switch } from 'react-router-dom'
import Elements from '../shared-elements'
import PlanRouteDetails from './PlanRouteDetails'
import { PlanVehicle, Vehicle } from '../types'

const PlanWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

interface IPlanProps {
  plan: PlanVehicle[]
  vehicles: Vehicle[]
  dispatchOffers: () => void
}

const Plan = ({ plan: planVehicles, dispatchOffers, vehicles }: IPlanProps) => {
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
              {activePlanVehicles.map((activePlanVehicle, i) => (
                <PlanRouteDetails
                  key={i}
                  vehicle={activePlanVehicle}
                  routeNumber={i + 1}
                  color={
                    vehicles.find(
                      (vehicle) => vehicle.id === activePlanVehicle.id
                    )?.color
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
      <Route
        exact
        path={[`${path}/current-plan`, `${path}/current-plan/:routeId`]}
      ></Route>
    </Switch>
  )
}

export default Plan
