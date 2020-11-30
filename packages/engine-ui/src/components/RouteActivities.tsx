import React from 'react'
import { FlyToInterpolator } from 'react-map-gl'
import styled from 'styled-components'
import { Activity, Route } from '../types'
import * as helpers from '../utils/helpers'
import * as Elements from '../shared-elements'
import { useRouteMatch } from 'react-router-dom'
import * as stores from '../utils/state/stores'

const ActivityGroup = styled.div`
  margin-left: auto;
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
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
  const setUIState = stores.ui((state) => state.dispatch)
  const setMap = stores.map((state) => state.set)

  const activities = route.activities ? route.activities.slice(1, -1) : []
  const isProposedPlan = useRouteMatch({
    path: ['/plans/routes/:routeId'],
  })

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

  const redirectTo = (activityId: string) => {
    return isProposedPlan
      ? `/plans/routes/${route.id}/${activityId}`
      : `/bookings/${activityId}`
  }

  const getDistance = (distance: number) => {
    return Math.round(distance / 1000)
  }
  const getDuration = (duration: number) => {
    return Math.round(duration / 60)
  }

  return (
    <Wrapper>
      {groupByLocation(activities).map((activityGroup, index) => (
        <ActivityInfo key={index}>
          <p>{index + 1}</p>

          <div>
            <p>
              {getDistance(activityGroup[0].distance)} km, c:a
              {getDuration(activityGroup[0].duration)} min
            </p>
          </div>
          <div>
            <p>{getLabelForActivities(activityGroup[0].type)}</p>
          </div>
          <ActivityGroup>
            {activityGroup.map((activity, i) => (
              <Elements.Links.RoundedLink
                key={i}
                onMouseOver={() =>
                  setUIState({
                    type: 'highlightBooking',
                    payload: activity.id,
                  })
                }
                onMouseLeave={() =>
                  setUIState({ type: 'highlightBooking', payload: undefined })
                }
                to={() => redirectTo(activity.id)}
                onClick={() =>
                  setMap({
                    latitude: activity.address.lat,
                    longitude: activity.address.lon,
                    zoom: 10,
                    transitionDuration: 2000,
                    transitionInterpolator: new FlyToInterpolator(),
                    transitionEasing: (t: number) => t * (2 - t),
                  })
                }
              >
                {helpers.getLastFourChars(activity.id).toUpperCase()}
              </Elements.Links.RoundedLink>
            ))}
          </ActivityGroup>
        </ActivityInfo>
      ))}
    </Wrapper>
  )
}

export default RouteActivities
