import React from 'react'

import Elements from './Elements'

import styled from 'styled-components'
import { Link } from 'react-router-dom'

const ActivityInfo = styled.div`
  display: flex;
  align-items: center;

  p:first-of-type {
    margin-right: 1rem;
  }

  p:last-of-type {
    margin-right: 0.5rem;
  }
`

const Line = styled.div`
  border-top: 1px solid #dedede;
  margin: 1rem 0;
`

const BookingLink = styled(Link)`
  background: #e6ffe6;
  border-radius: 0.75rem;
  padding: 0.5rem 1rem;
  text-decoration: none;
  display: inline-block;
  font-size: 0.875rem;
  color: black;
  :visited {
    color: black;
  }
  :hover {
    background: #ccffcc;
  }
`
const CarDetails = ({ car }) => {
  if (!car) return <p>Loading...</p>
  const activities = car.activities.slice(1, -1)

  const getLabelForActivities = (type) => {
    switch (type) {
      case 'pickupShipment':
        return 'Upphämtning'
      case 'deliverShipment':
        return 'Avlämning'
      default:
        return
    }
  }
  return (
    <div>
      <Elements.StrongParagraph>ID:</Elements.StrongParagraph>
      <span>{car.id}</span>
      <Line />
      <Elements.StrongParagraph>Rutt</Elements.StrongParagraph>
      {activities.map((activity, index) => (
        <ActivityInfo key={index}>
          <p>{index + 1}</p>
          <p>{getLabelForActivities(activity.type)}</p>
          <BookingLink to={`/details?type=booking&id=${activity.id}`}>
            {activity.id}
          </BookingLink>
        </ActivityInfo>
      ))}
    </div>
  )
}

export default CarDetails
