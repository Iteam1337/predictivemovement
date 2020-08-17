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

      <Elements.StrongParagraph>Bokinginar på bil</Elements.StrongParagraph>

      {car.activities.length > 0 ? (
        <RouteActivities car={car} />
      ) : (
        <p>Inga bekräftade bokingar</p>
      )}
      <Line />
      <Elements.StrongParagraph>Rutt</Elements.StrongParagraph>

      {car.activities.length > 0 ? (
        <RouteActivities car={car} />
      ) : (
        <p>Ingen rutt planerad</p>
      )}
      <Line />
    </div>
  )
}

export default CarDetails
