import React from 'react'
import styled from 'styled-components'
import * as Elements from '../shared-elements'
import * as helpers from '../utils/helpers'
import { useRouteMatch } from 'react-router-dom'
import * as stores from '../utils/state/stores'
import * as types from '../types'

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
  lat: number | undefined
  lon: number | undefined
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
    if (lat && lon)
      helpers
        .getAddressFromCoordinate({ lat, lon })
        .then((data) =>
          set((current) => ({ ...current, loading: false, data }))
        )
        .catch((error) =>
          set((current) => ({ ...current, loading: false, error }))
        )
  }, [lat, lon])

  return state
}

enum EntityTypes {
  TRANSPORT = 'transport',
  BOOKING = 'booking',
}

const Component: React.FC<{
  position: { x?: number; y?: number; lat?: number; lon?: number }
}> = ({ position: { lat, lon, x, y } }) => {
  const { data, error, loading } = useAddressFromCoordinate({ lat, lon })

  const [lastFocusedInput, setUIState] = stores.ui((state) => [
    state.lastFocusedInput,
    state.dispatch,
  ])

  const createBookingOrTransportView = useRouteMatch<{}>({
    path: [
      '/bookings/add-booking',
      '/transports/add-transport',
      '/bookings/edit-booking/*',
    ],
    exact: true,
  })

  const tooltipTexts = {
    transport: {
      start: 'startposition',
      end: 'slutposition',
    },
    booking: {
      start: 'upphämtningsplats',
      end: 'leveransplats',
    },
  }

  const handleClose = () => setUIState({ type: 'hideTooltip' })

  const entityTypeFromPathname = (pathname: string): EntityTypes => {
    if (pathname.match('booking')) {
      return EntityTypes.BOOKING
    }
    return EntityTypes.TRANSPORT
  }

  const getAddAsInputButton = (
    pathname: string,
    inputCode: types.state.lastFocusedInput
  ) => (
    <Elements.Typography.InfoSmStrong>
      <AddButton
        onClick={() =>
          setUIState({ type: 'addAddressToLastClickedPosition', payload: data })
        }
      >
        {`Lägg till som ${
          tooltipTexts[entityTypeFromPathname(pathname)][inputCode]
        }`}
      </AddButton>
    </Elements.Typography.InfoSmStrong>
  )

  if (!x || !y || !lat || !lon) return null

  return (
    <Container x={x} y={y}>
      <CloseButtonContainer>
        <CloseButton onClick={handleClose}>X</CloseButton>
      </CloseButtonContainer>
      <ContentContainer>
        {loading && (
          <Elements.Typography.InfoSm>Läser in...</Elements.Typography.InfoSm>
        )}

        {error && (
          <Elements.Typography.InfoSm>
            Vi kunde inte hitta någon adress för den angivna koordinaten.
          </Elements.Typography.InfoSm>
        )}

        {data && (
          <>
            <AddressName>{data.name}</AddressName>
            <CountyName>{data.county}</CountyName>
            <Coordinate>
              {helpers.formatCoordinateToFixedDecimalLength({
                lat,
                lon,
                length: 6,
              })}
            </Coordinate>

            {lastFocusedInput &&
              createBookingOrTransportView &&
              getAddAsInputButton(
                createBookingOrTransportView.path,
                lastFocusedInput
              )}
          </>
        )}
      </ContentContainer>
    </Container>
  )
}

export default Component
