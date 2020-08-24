import React from 'react'
import { FlyToInterpolator } from 'react-map-gl'
import styled from 'styled-components'
import { ViewportContext } from '../utils/ViewportContext'
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

const RouteActivities = ({ vehicle }) => {
  const { setViewport } = React.useContext(ViewportContext)
  const activities = vehicle.activities.slice(1, -1)

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
          <Elements.RoundedLink
            to={`/details?type=booking&id=${activity.id}`}
            onClick={() =>
              setViewport({
                latitude: activity.address.lat,
                longitude: activity.address.lon,
                zoom: 10,
                transitionDuration: 2000,
                transitionInterpolator: new FlyToInterpolator(),
                transitionEasing: (t) => t * (2 - t),
              })
            }
          >
            {activity.id}
          </Elements.RoundedLink>
        </ActivityInfo>
      ))}
    </div>
  )
}

export default RouteActivities
