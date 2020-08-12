import React from 'react'
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
          <Elements.RoundedLink to={`/details?type=booking&id=${activity.id}`}>
            {activity.id}
          </Elements.RoundedLink>
        </ActivityInfo>
      ))}
    </div>
  )
}

export default RouteActivities
