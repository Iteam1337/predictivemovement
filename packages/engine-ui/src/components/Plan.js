import React from 'react'
import styled from 'styled-components'
import Elements from './Elements'
import { useHistory } from 'react-router-dom'
import Icons from '../assets/Icons'
import RouteActivities from './RouteActivities'
import { UIStateContext } from '../utils/UIStateContext'
import { FlyToInterpolator } from 'react-map-gl'

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

const Plan = ({ plan }) => {
  const { dispatch } = React.useContext(UIStateContext)
  const [showRouteInfo, setOpenRouteInfo] = React.useState(false)
  const history = useHistory()
  const driverPlans = plan.filter((d) => d.activities.length > 0)

  const toggle = (id) =>
    setOpenRouteInfo((showRouteInfo) => (showRouteInfo === id ? undefined : id)) // close if currently open

  if (!driverPlans.length)
    return (
      <Elements.NoInfoParagraph>
        Det finns inga planerade rutter...
      </Elements.NoInfoParagraph>
    )

  return (
    <div>
      {driverPlans.map((vehicle, index) => (
        <div key={vehicle.id}>
          <RouteTitleWrapper
            onClick={() => {
              toggle(vehicle.id)
              history.push('/')
            }}
          >
            <Elements.StrongParagraph>
              Rutt {index + 1}
            </Elements.StrongParagraph>
            <Chevron active={showRouteInfo === vehicle.id ? true : undefined} />
          </RouteTitleWrapper>

          {showRouteInfo === vehicle.id && (
            <>
              <Elements.FlexRowWrapper>
                <Elements.StrongParagraph>Transport</Elements.StrongParagraph>
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
      ))}
    </div>
  )
}

export default Plan
