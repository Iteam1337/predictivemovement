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
`
const ActivityInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: baseline;
  margin-bottom: 2rem;
  padding: 1rem 0;

  p {
    margin: 0;
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

const Line = styled.div`
  border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  flex: 1;
  height: 1px;
`

const TimeWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  margin-bottom: 1rem;
`
const EndOfTransportWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`

const SmallParagraph = styled.p`
  font-size: 12px;
  margin-left: 0.25rem;
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

  const maybeActivities = route.activities || []
  const activities = maybeActivities.slice(1, -1)
  const transportEndPos = Array.from(maybeActivities).reverse()[0]

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
      <Elements.Typography.BoldParagraph>
        Start
      </Elements.Typography.BoldParagraph>
      {groupByLocation(activities).map((activityGroup, index) => (
        <>
          <ActivityInfo key={index}>
            <TimeWrapper>
              <Line />
              <SmallParagraph>
                {getDuration(activityGroup[0].duration)} min (
                {getDistance(activityGroup[0].distance)} km)
              </SmallParagraph>
            </TimeWrapper>
            <div
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <Elements.Typography.BoldParagraph>
                  {getLabelForActivities(activityGroup[0].type)}
                </Elements.Typography.BoldParagraph>
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
                      setUIState({
                        type: 'highlightBooking',
                        payload: undefined,
                      })
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
            </div>
          </ActivityInfo>
        </>
      ))}
      <EndOfTransportWrapper>
        <Elements.Typography.BoldParagraph>
          Slut
        </Elements.Typography.BoldParagraph>
        <SmallParagraph>
          {getDuration(transportEndPos.duration)} min (
          {getDistance(transportEndPos.distance)} km)
        </SmallParagraph>
      </EndOfTransportWrapper>
    </Wrapper>
  )
}

export default RouteActivities
