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

const PickUpInfo = styled.div`
  border-left: 3px solid #19aa6e;
  flex: 4;
  height: 130px;
  padding: 1rem;
`

const Circle = styled.div<{ active: boolean }>`
  background-color: ${(props) => (props.active ? '#d4693f' : '#fff')};
  border: 3px solid #19aa6e;
  height: 15px;
  width: 15px;
  border-radius: 50%;
  top: 43%;
  margin-left: -3.15rem;
  position: relative;
  z-index: 2;
`

const SpeechBubble = styled.div`
  position: relative;
  border: 2px solid #19aa6e;
  text-align: center;
  padding: 7px;
  border-radius: 5px;
  margin-left: 1rem;
  margin-right: -1rem;
  height: 100%;

  :after {
    content: '';
    position: absolute;
    display: block;
    z-index: 1;
    border-style: solid;
    border-color: transparent #19aa6e;
    border-width: 10px 10px 10px 0;
    top: 50%;
    left: -10px;
    margin-top: -10px;
  }
`

const TimeWrapper = styled.div`
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
      {groupByLocation(activities).map((activityGroup, index) => {
        return (
          <ActivityInfo key={index}>
            <TimeWrapper>
              <div style={{ flex: '1' }}>
                <SmallParagraph>
                  {getDuration(activityGroup[0].duration)} min
                </SmallParagraph>
                <SmallParagraph>
                  ({getDistance(activityGroup[0].distance)} km)
                </SmallParagraph>
              </div>
              <PickUpInfo style={{ flex: '4' }}>
                <SpeechBubble>
                  <Circle active={false} />
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '-15px',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '0.80rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {getLabelForActivities(activityGroup[0].type)}
                    </p>
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
                  <div style={{ textAlign: 'left' }}>
                    <SmallParagraph>
                      {activityGroup[0].address.street}
                    </SmallParagraph>
                    <SmallParagraph>
                      {activityGroup[0].address.city}
                    </SmallParagraph>
                  </div>
                </SpeechBubble>
              </PickUpInfo>
            </TimeWrapper>
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
