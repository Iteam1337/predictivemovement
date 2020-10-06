import React from 'react'
import { FlyToInterpolator } from 'react-map-gl'
import styled from 'styled-components'
import { Activity, Route } from '../types'
import helpers from '../utils/helpers'
import { UIStateContext } from '../utils/UIStateContext'
import Elements from './Elements'

const ActivityGroup = styled.div`
  margin-left: auto;
  display: flex;
  flex-direction: column;
`
const ActivityInfo = styled.div`
  display: flex;
  align-items: baseline;
  margin: 1rem 0;

  p {
    margin: 0;
  }

  p:first-of-type {
    margin-right: 1rem;
  }

  a {
    margin-left: auto;
  }

  a:not(:first-child) {
    margin-top: 1rem;
  }
`

const Wrapper = styled.div`
  overflow: auto;
  height: 100%;
`

interface Props {
  route: Route
}

const groupByLocation = (activities: Activity[]) => {
  const { data } = activities.reduce<{
    type: string
    address: string
    data: Activity[][]
  }>(
    (prev, curr) => {
      const currAddress = JSON.stringify(curr.address)
      if (prev.type === curr.type && prev.address === currAddress) {
        const [last] = prev.data.slice(0).reverse()

        return {
          ...prev,
          data: [...prev.data.slice(0, -1), [...last, curr]],
        }
      }

      return {
        type: curr.type,
        address: currAddress,
        data: [...prev.data, [curr]],
      }
    },
    { type: '', address: '', data: [] }
  )

  return data
}

const RouteActivities = ({ route }: Props) => {
  const { dispatch } = React.useContext(UIStateContext)
  const activities = route.activities.slice(1, -1)

  const getLabelForActivities = (type: string) => {
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
      {groupByLocation(activities).map((activityGroup, index) => (
        <ActivityInfo key={index}>
          <p>{index + 1}</p>
          <p>{getLabelForActivities(activityGroup[0].type)}</p>
          <ActivityGroup>
            {activityGroup.map((activity, i) => (
              <Elements.RoundedLink
                key={i}
                onMouseOver={() =>
                  dispatch({ type: 'highlightBooking', payload: activity.id })
                }
                onMouseLeave={() =>
                  dispatch({ type: 'highlightBooking', payload: undefined })
                }
                to={`/plans/routes/${route.id}/booking/${activity.id}`}
                onClick={() =>
                  dispatch({
                    type: 'viewport',
                    payload: {
                      latitude: activity.address.lat,
                      longitude: activity.address.lon,
                      zoom: 10,
                      transitionDuration: 2000,
                      transitionInterpolator: new FlyToInterpolator(),
                      transitionEasing: (t: number) => t * (2 - t),
                    },
                  })
                }
              >
                {helpers.getLastFourChars(activity.id).toUpperCase()}
              </Elements.RoundedLink>
            ))}
          </ActivityGroup>
        </ActivityInfo>
      ))}
    </Wrapper>
  )
}

export default RouteActivities
