import React from 'react'
import styled from 'styled-components'
import MainRouteLayout from './layout/MainRouteLayout'
import PlanRouteDetails from './PlanRouteDetails'
import { IPlanVehicle } from './Plan'

const PlanWrapper = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
`

interface CurrentPlanProps {
  plan: IPlanVehicle[]
}

const CurrentPlan = ({ plan: planVehicles }: CurrentPlanProps) => {
  return (
    <MainRouteLayout redirect="/plans">
      <PlanWrapper>
        <h3>Aktuell plan</h3>
        {planVehicles.map((vehicle, index) => (
          <PlanRouteDetails
            key={index}
            vehicle={vehicle}
            routeNumber={index + 1}
          />
        ))}
      </PlanWrapper>
    </MainRouteLayout>
  )
}

export default CurrentPlan
