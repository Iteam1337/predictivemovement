import React from 'react'
import { FlyToInterpolator } from 'react-map-gl'
import styled from 'styled-components'
import helpers from '../utils/helpers'
import { UIStateContext } from '../utils/UIStateContext'
import Elements from '../shared-elements'

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

const Wrapper = styled.div`
  overflow: auto;
  height: 100%;
`

const RouteActivities = ({ vehicle }) => {
  const { dispatch } = React.useContext(UIStateContext)
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
    <Wrapper>
      {activities.map((activity, index) => (
        <ActivityInfo key={index}>
          <p>{index + 1}</p>
          <p>{getLabelForActivities(activity.type)}</p>
          <Elements.Links.RoundedLink
            onMouseOver={() =>
              dispatch({ type: 'highlightBooking', payload: activity.id })
            }
            onMouseLeave={() =>
              dispatch({ type: 'highlightBooking', payload: undefined })
            }
            to={`/plans/routes/${vehicle.id}/booking/${activity.id}`}
            onClick={() =>
              dispatch({
                type: 'viewport',
                payload: {
                  latitude: activity.address.lat,
                  longitude: activity.address.lon,
                  zoom: 10,
                  transitionDuration: 2000,
                  transitionInterpolator: new FlyToInterpolator(),
                  transitionEasing: (t) => t * (2 - t),
                },
              })
            }
          >
            {helpers.getLastFourChars(activity.id).toUpperCase()}
          </Elements.Links.RoundedLink>
        </ActivityInfo>
      ))}
    </Wrapper>
  )
}

export default RouteActivities
