import React from 'react'
import styled from 'styled-components'
import { useRouteMatch, Route, Switch } from 'react-router-dom'
import Elements from '../shared-elements'
import PlanRouteDetails from './PlanRouteDetails'
import { Route as PlanRoute } from '../types'

const PlanWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`

interface IPlanProps {
  plan: PlanRoute[]
  dispatchOffers: () => void
}

const Plan = ({ plan: routes, dispatchOffers }: IPlanProps) => {
  const activeRoutes = routes.filter((d) => d.activities.length > 0)
  const { path } = useRouteMatch()

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
                <PlanRouteDetails key={i} route={route} routeNumber={i + 1} />
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
      />
    </Switch>
  )
}

export default Plan
