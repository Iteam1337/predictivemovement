import React from 'react'
import styled from 'styled-components'
import Elements from '../shared-elements'
import { UIStateContext } from '../utils/UIStateContext'
import helpers from '../utils/helpers'
import { useLocation } from 'react-router-dom'

const Container = styled.div<{ x: number; y: number }>`
  position: absolute;
  top: ${({ y }) => y + 10}px;
  left: ${({ x }) => x + 10}px;
  background: white;
  border-radius: 0.25rem;
  min-width: 150px;
  padding: 4px;
  font-size: 0.75rem;
`

const ContentContainer = styled.div`
  padding: 0.25rem;
  padding-top: 0;
`

const CloseButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
`

const CloseButton = styled.button`
  font-size: 0.75rem;
  background: none;
  border: none;
  outline: none;
  font-weight: bold;
  padding: 0;
`

const AddressName = styled.p`
  font-weight: bold;
  margin: 0.25rem;
  margin-top: 0;
`

const CountyName = styled.p`
  margin: 0.25rem;
`

const Coordinate = styled.p`
  color: gray;
  margin: 0.25rem;
`

const AddButton = styled(CloseButton)`
  margin: 0.25rem;
`

const useAddressFromCoordinate = ({
  lat,
  lon,
}: {
  lat: number
  lon: number
}) => {
  const [state, set] = React.useState<{
    error: Error | undefined
    loading: boolean
    data: { name: string; county: string } | undefined
  }>({
    error: undefined,
    loading: false,
    data: undefined,
  })

  React.useEffect(() => {
    set({ loading: true, data: undefined, error: undefined })

    helpers
      .getAddressFromCoordinate({ lat, lon })
      .then((data) => set((current) => ({ ...current, loading: false, data })))
      .catch((error) =>
        set((current) => ({ ...current, loading: false, error }))
      )
  }, [lat, lon])

  return state
}

const Component: React.FC<{
  position: { x: number; y: number; lat: number; lon: number }
}> = ({ position: { lat, lon, ...rest } }) => {
  const { data, error, loading } = useAddressFromCoordinate({ lat, lon })
  const location = useLocation()
  const {
    state: { lastFocusedInput },
    dispatch,
  } = React.useContext(UIStateContext)

  const tooltipTexts = {
    vehicle: {
      start: 'startposition',
      end: 'slutposition',
    },
    booking: {
      start: 'upphämtningsplats',
      end: 'leveransplats',
    },
  }

  const parseLastFocusedInputToHumanReadable = (
    lastFocusedInputCode: 'start' | 'end'
  ) => {
    switch (location.pathname) {
      case '/transports/add-vehicle':
        return tooltipTexts['vehicle'][lastFocusedInputCode]
      case '/bookings/add-booking':
        return tooltipTexts['booking'][lastFocusedInputCode]
    }
  }

  const handleClose = () => dispatch({ type: 'hideTooltip' })

  const formatCoordinate = ({ lat, lon }: { lat: number; lon: number }) =>
    `${lat.toFixed(6)}, ${lon.toFixed(6)}`

  return (
    <Container {...rest}>
      <CloseButtonContainer>
        <CloseButton onClick={handleClose}>X</CloseButton>
      </CloseButtonContainer>
      <ContentContainer>
        {loading && (
          <Elements.Typography.SmallInfo>
            Läser in...
          </Elements.Typography.SmallInfo>
        )}

        {error && (
          <Elements.Typography.SmallInfo>
            Vi kunde inte hitta någon adress för den angivna koordinaten.
          </Elements.Typography.SmallInfo>
        )}

        {data && (
          <>
            <AddressName>{data.name}</AddressName>
            <CountyName>{data.county}</CountyName>
            <Coordinate>{formatCoordinate({ lat, lon })}</Coordinate>

            {Boolean(lastFocusedInput) && (
              <Elements.Typography.StrongSmallInfo>
                <AddButton
                  onClick={() =>
                    dispatch({
                      type: 'addAddressToLastClickedPosition',
                      payload: data,
                    })
                  }
                >
                  {`Lägg till som ${parseLastFocusedInputToHumanReadable(
                    lastFocusedInput
                  )}`}
                </AddButton>
              </Elements.Typography.StrongSmallInfo>
            )}
          </>
        )}
      </ContentContainer>
    </Container>
  )
}

export default Component
