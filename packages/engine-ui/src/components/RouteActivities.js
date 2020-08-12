import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Elements from './Elements'

const ActivityInfo = styled.div`
  display: flex;
  align-items: center;

  p:first-of-type {
    margin-right: 1rem;
  }

  a {
    margin-left: auto;
  }
`

const BookingLink = styled(Link)`
  background: #e6ffe6;
  border-radius: 0.75rem;
  padding: 0.5rem 0.6rem;
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
const RouteActivities = ({ car }) => {
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

export default RouteActivities
