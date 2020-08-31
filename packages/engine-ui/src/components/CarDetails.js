import React from 'react'
import styled from 'styled-components'
import Elements from '../shared-elements'
import RouteActivities from './RouteActivities'
import NestedMenu from './layout/NestedMenu'

const Line = styled.div`
  border-top: 1px solid #dedede;
  margin: 1rem 0;
`

const CarDetails = ({ car }) => {
  if (!car) return <p>Loading...</p>

  return (
    <NestedMenu>
      <Elements.Layout.Container>
        <Elements.Layout.FlexRowWrapper>
          <h3>Transport</h3>
          <Elements.Typography.RoundedLabelDisplay margin="0 0.5rem">
            {car.id}
          </Elements.Typography.RoundedLabelDisplay>
        </Elements.Layout.FlexRowWrapper>
        <Line />
        {car.activities.length > 0 && (
          <>
            <Elements.Typography.StrongParagraph>
              Rutt
            </Elements.Typography.StrongParagraph>
            <RouteActivities car={car} />
          </>
        )}
      </Elements.Layout.Container>
    </NestedMenu>
  )
}

export default CarDetails
