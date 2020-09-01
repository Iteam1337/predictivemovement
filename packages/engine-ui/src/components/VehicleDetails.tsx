import React from 'react'
import styled from 'styled-components'
import Elements from '../shared-elements'
import RouteActivities from './RouteActivities'
import MainRouteLayout from './layout/MainRouteLayout'
import { useParams } from 'react-router-dom'

const Line = styled.div`
  border-top: 1px solid #dedede;
  margin: 1rem 0;
`

const VehicleDetails: React.FC<{ vehicles: any }> = ({ vehicles }) => {
  const { vehicleId } = useParams()

  const vehicle = vehicles.find((v: any) => v.id === vehicleId)

  if (!vehicle) return <p>Loading...</p>

  return (
    <MainRouteLayout redirect={'/transports'}>
      <Elements.Layout.Container>
        <Elements.Layout.FlexRowWrapper>
          <h3>Transport</h3>
          <Elements.Links.RoundedLink margin="0 0.5rem">
            {vehicle.id}
          </Elements.Links.RoundedLink>
        </Elements.Layout.FlexRowWrapper>
        <Line />
        {vehicle.activities && vehicle.activities.length > 0 && (
          <>
            <Elements.Typography.StrongParagraph>
              Rutt
            </Elements.Typography.StrongParagraph>
            <RouteActivities vehicle={vehicle} />
          </>
        )}
      </Elements.Layout.Container>
    </MainRouteLayout>
  )
}

export default VehicleDetails
