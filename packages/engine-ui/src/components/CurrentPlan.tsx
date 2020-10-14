import React from 'react'
import styled from 'styled-components'
import { Route } from '../types'
import MainRouteLayout from './layout/MainRouteLayout'
import PlanRouteDetails from './PlanRouteDetails'

const PlanWrapper = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
`

interface CurrentPlanProps {
  plan: Route[]
}

const CurrentPlan = ({ plan: routes }: CurrentPlanProps) => {
  return (
    <MainRouteLayout redirect="/plans">
      <PlanWrapper>
        <h3>Aktuell plan</h3>
        {routes.map((route, index) => (
          <PlanRouteDetails key={index} route={route} routeNumber={index + 1} />
        ))}
      </PlanWrapper>
    </MainRouteLayout>
  )
}

export default CurrentPlan
