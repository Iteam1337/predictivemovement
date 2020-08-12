import React from 'react'
import styled from 'styled-components'
import Elements from './Elements'
import RouteActivities from './RouteActivities'

const Line = styled.div`
  border-top: 1px solid #dedede;
  margin: 1rem 0;
`

const CarDetails = ({ car }) => {
  if (!car) return <p>Loading...</p>

  return (
    <div>
      <Elements.StrongParagraph>ID:</Elements.StrongParagraph>
      <span>{car.id}</span>
      <Line />
      {car.activities.length > 0 && (
        <>
          <Elements.StrongParagraph>Rutt</Elements.StrongParagraph>
          <RouteActivities car={car} />
        </>
      )}
    </div>
  )
}

export default CarDetails
