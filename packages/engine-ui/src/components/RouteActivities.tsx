import React from 'react'
import { FlyToInterpolator } from 'react-map-gl'
import styled from 'styled-components'
import { Route } from '../types'
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

const Details = styled.div`
  p:first-of-type {
    margin-top: 0.25rem;
  }
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

const SpeechBubble = styled.div<{ highlight: boolean }>`
  position: relative;
  text-align: center;
  padding: 9px;
  border-radius: 5px;
  flex: 1;
  text-align: left;
  height: 100%;
  margin-left: 0.5rem;

  border: ${(p) =>
    p.highlight
      ? '1px solid rgba(0, 0, 0, 1)'
      : '1px solid rgba(0, 0, 0, 0.3)'};
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

const RouteActivities = ({ route }: Props) => {
  const setUIState = stores.ui((state) => state.dispatch)
  const setMap = stores.map((state) => state.set)

  const maybeActivities = route.activities || []
  const activities = maybeActivities.slice(1, -1)
  const [highlightedActivity, setHighlightedActivity] = React.useState('')

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
                  {helpers.getDuration(activity.duration)}
                </SmallParagraph>
                <SmallParagraph>
                  ({helpers.getDistance(activity.distance)})
                </SmallParagraph>
              </TimeContainer>

              <ActivityListItemContainer>
                <SpeechBubble
                  onMouseOver={() => {
                    setUIState({
                      type: 'highlightBooking',
                      payload: activity.id,
                    })
                    setHighlightedActivity(activity.id)
                  }}
                  onMouseLeave={() => {
                    setUIState({
                      type: 'highlightBooking',
                      payload: undefined,
                    })
                    setHighlightedActivity('')
                  }}
                  highlight={highlightedActivity === activity.id}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                    }}
                  >
                    <Elements.Typography.InfoMdStrong>
                      {getLabelForActivities(activity.type)}
                    </Elements.Typography.InfoMdStrong>
                    <ActivityGroup>
                      <Elements.Links.RoundedLink
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
                  <Details>
                    <SmallParagraph>{activity.address.street}</SmallParagraph>
                    <SmallParagraph>{activity.address.city}</SmallParagraph>
                  </Details>
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
