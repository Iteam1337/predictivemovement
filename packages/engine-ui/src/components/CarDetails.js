import React from 'react'
import styled from 'styled-components'
import Elements from '../shared-elements'
import RouteActivities from './RouteActivities'
import NestedMenu from './layout/NestedMenu'
import moment from 'moment'
const Line = styled.div`
  border-top: 1px solid #dedede;
  margin: 1rem 0;
`

const Paragraph = styled.p`
  margin-top: 0;
  margin-bottom: 0.5rem;
`

const CarDetails = ({ car }) => {
  if (!car) return <p>Loading...</p>

  return (
    <NestedMenu>
      <Elements.Layout.Container>
        <Elements.Layout.FlexRowWrapper>
          <h3>Transport</h3>
          <Elements.Links.RoundedLink
            to={`/details?type=vehicle&id=${car.id}`}
            margin="0 0.5rem"
          >
            {car.id}
          </Elements.Links.RoundedLink>
        </Elements.Layout.FlexRowWrapper>
        {car.capacity && (
          <>
            <Elements.Typography.StrongParagraph>
              Kapacitet
            </Elements.Typography.StrongParagraph>
            <Paragraph>Maxvolym: {car.capacity.volume}kbm</Paragraph>
            <Paragraph>Maxvikt: {car.capacity.weight}kg</Paragraph>
          </>
        )}
        <Elements.Typography.StrongParagraph>
          Körschema
        </Elements.Typography.StrongParagraph>
        <Elements.Layout.FlexRowWrapper>
          <Paragraph>
            {moment(car.earliest_start).format('LT')} -{' '}
            {moment(car.latest_end).format('LT')}{' '}
          </Paragraph>
        </Elements.Layout.FlexRowWrapper>
        {car.end_address.name && (
          <Paragraph>Slutposition: {car.end_address.name}</Paragraph>
        )}
        <Line />

        {car.activities && car.activities.length > 0 && (
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
