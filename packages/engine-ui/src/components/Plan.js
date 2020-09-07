import React from 'react'
import styled from 'styled-components'
import Elements from './Elements'
import { useHistory, useParams } from 'react-router-dom'
import Icons from '../assets/Icons'
import RouteActivities from './RouteActivities'
import { UIStateContext } from '../utils/UIStateContext'
import { FlyToInterpolator } from 'react-map-gl'
import SharedElements from '../shared-elements/'

const RouteTitleWrapper = styled.div`
  display: grid;
  grid-template-columns: 50% 1fr;
  align-items: baseline;
  justify-items: flex-start;
  width: 100%;
`

const Chevron = styled(Icons.Arrow)`
  transform: ${({ active }) => active && `rotate(180deg)`};
  transition: transform 0.2s;
  justify-self: flex-end;
`

const PlanWrapper = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100%;
`

const Plan = ({ plan, dispatchOffers }) => {
  const { dispatch } = React.useContext(UIStateContext)
  const history = useHistory()
  const driverPlans = plan.filter((d) => d.activities.length > 0)
  const { routeId } = useParams()

  const toggle = (id) => {
    if (id === routeId) {
      return history.push('/plans')
    }

    return history.push(`/plans/route/${id}`)
  }

  return (
    <PlanWrapper>
      <h3>Plan</h3>
      <div>
        {!driverPlans.length ? (
          <Elements.NoInfoParagraph>
            Det finns inga planerade rutter...
          </Elements.NoInfoParagraph>
        ) : (
          driverPlans.map((vehicle, index) => (
            <div key={vehicle.id}>
              <RouteTitleWrapper
                onClick={() => {
                  toggle(vehicle.id)
                }}
              >
                <Elements.StrongParagraph>
                  Rutt {index + 1}
                </Elements.StrongParagraph>
                <Chevron active={routeId === vehicle.id ? true : undefined} />
              </RouteTitleWrapper>

              {routeId === vehicle.id && (
                <>
                  <Elements.FlexRowWrapper>
                    <Elements.StrongParagraph>
                      Transport
                    </Elements.StrongParagraph>
                    <Elements.RoundedLink
                      margin="0 0.5rem"
                      to={`/transports/${vehicle.id}`}
                      onClick={() =>
                        dispatch({
                          type: 'viewport',
                          payload: {
                            latitude: vehicle.position.lat,
                            longitude: vehicle.position.lon,
                            zoom: 10,
                            transitionDuration: 3000,
                            transitionInterpolator: new FlyToInterpolator(),
                            transitionEasing: (t) => t * (2 - t),
                          },
                        })
                      }
                    >
                      {vehicle.id}
                    </Elements.RoundedLink>
                  </Elements.FlexRowWrapper>
                  <RouteActivities vehicle={vehicle} />
                </>
              )}
            </div>
          ))
        )}
      </div>
      <SharedElements.Buttons.SubmitButton
        justifySelf="center"
        onClick={dispatchOffers}
      >
        Bekräfta plan
      </SharedElements.Buttons.SubmitButton>
    </PlanWrapper>
  )
}

export default Plan
