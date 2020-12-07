import React from 'react'
import { FlyToInterpolator } from 'react-map-gl'
import styled from 'styled-components'
import { Activity, Route } from '../types'
import * as helpers from '../utils/helpers'
import * as Elements from '../shared-elements'
import { useRouteMatch } from 'react-router-dom'
import * as stores from '../utils/state/stores'
import triangleIcon from '../assets/triangle.svg'

const ActivityGroup = styled.div`
  margin-left: auto;
  display: flex;
  flex-direction: column;
`

const ActivityInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: baseline;

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

const TimeContainer = styled.div`
  margin-right: 0.5rem;
  flex-basis: 15%;
`

const ActivityListItemContainer = styled.div`
  padding: 1rem;
  border-left: 3px solid #19aa6e;
  flex: 1;
  position: relative;
  display: flex;
  :after {
    content: '';
    position: absolute;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: white;
    left: -12px;
    border: 3px solid #19aa6e;
    top: calc(50% - 8px);
  }
`

const SpeechBubble = styled.div`
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.3);
  text-align: center;
  padding: 9px;
  border-radius: 5px;
  flex: 1;
  text-align: left;
  height: 100%;
  margin-left: 0.5rem;

  :hover {
    border: 1px solid rgba(0, 0, 0, 0.6);
  }
`

const TimelineItem = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  height: 100%;
`

const EndOfTransportWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`

const SmallParagraph = styled.p`
  font-size: 12px;
  margin: 0;
`

interface Props {
  route: Route
}

// const groupByLocation = (activities: Activity[]) => {
//   const { data } = activities.reduce<{
//     type: string
//     address: string
//     data: Activity[][]
//   }>(
//     (prev, curr) => {
//       const currAddress = JSON.stringify(curr.address)
//       if (prev.type === curr.type && prev.address === currAddress) {
//         const [last] = prev.data.slice(0).reverse()

//         return {
//           ...prev,
//           data: [...prev.data.slice(0, -1), [...last, curr]],
//         }
//       }

//       return {
//         type: curr.type,
//         address: currAddress,
//         data: [...prev.data, [curr]],
//       }
//     },
//     { type: '', address: '', data: [] }
//   )

//   return data
// }

const RouteActivities = ({ route }: Props) => {
  const setUIState = stores.ui((state) => state.dispatch)
  const setMap = stores.map((state) => state.set)

  const maybeActivities = route.activities || []
  const activities = maybeActivities.slice(1, -1)

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
      {activities.map((activity, index) => {
        return (
          <ActivityInfo key={index}>
            <TimelineItem>
              <TimeContainer>
                <SmallParagraph>
                  {getDuration(activity.duration)} min{' '}
                </SmallParagraph>
                <SmallParagraph>
                  ({getDistance(activity.distance)} km)
                </SmallParagraph>
              </TimeContainer>

              <ActivityListItemContainer>
                <SpeechBubble>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      marginBottom: '.5rem',
                    }}
                  >
                    <Elements.Typography.InfoMdStrong>
                      {getLabelForActivities(activity.type)}
                    </Elements.Typography.InfoMdStrong>
                    <ActivityGroup>
                      <Elements.Links.RoundedLink
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
                    </ActivityGroup>
                  </div>

                  <div style={{ textAlign: 'left' }}>
                    <SmallParagraph>{activity.address.street}</SmallParagraph>
                    <SmallParagraph>{activity.address.city}</SmallParagraph>
                  </div>
                </SpeechBubble>
              </ActivityListItemContainer>
            </TimelineItem>
          </ActivityInfo>
        )
      })}
      <EndOfTransportWrapper>
        <Elements.Typography.BoldParagraph>
          Slut
        </Elements.Typography.BoldParagraph>
      </EndOfTransportWrapper>
    </Wrapper>
  )
}

export default RouteActivities
