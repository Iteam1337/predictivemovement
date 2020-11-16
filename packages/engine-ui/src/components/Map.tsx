import React from 'react'
import { StaticMap } from 'react-map-gl'
import DeckGL from '@deck.gl/react'
import * as mapUtils from '../utils/mapUtils'
import { useHistory } from 'react-router-dom'
import Tooltip from './Tooltip'
import * as stores from '../utils/state/stores'
import * as stateTypes from '../utils/state/types'

const useMapDataWithFilters = () => {
  const filters = stores.mapFilters(
    React.useCallback(({ set, ...filtersWithoutSet }) => filtersWithoutSet, [])
  )

  const mapData = stores.mapData(
    React.useCallback(({ set, ...stateWithoutSet }) => stateWithoutSet, [])
  )

  const filterFunctions: stateTypes.MapDataFilterFunctions = React.useMemo(
    () => ({
      bookings: (
        state: stateTypes.MapDataState,
        options: { route?: boolean } = { route: false }
      ) =>
        Object.assign({}, state, {
          bookings: mapData.bookings.map((booking) => {
            if (options.route) return booking
            const { route, ...rest } = booking
            return rest
          }),
        }),
      transports: (state: stateTypes.MapDataState) =>
        Object.assign({}, state, {
          transports: mapData.transports,
        }),
      plan: (state: stateTypes.MapDataState) =>
        Object.assign({}, state, {
          plan: mapData.plan,
        }),
      bookingDetailsById: (state: stateTypes.MapDataState) =>
        Object.assign({}, state, {
          bookings: mapData.bookings.filter(({ id }) =>
            filters.bookingDetailsById
              ? id === filters.bookingDetailsById
              : true
          ),
        }),
      excludedBookings: (state: stateTypes.MapDataState) =>
        Object.assign({}, state, {
          plan: Object.assign({}, state.plan, {
            excludedBookings: mapData.plan.excludedBookings,
          }),
        }),
      planRouteDetailsById: (state: stateTypes.MapDataState) =>
        Object.assign({}, state, {
          plan: Object.assign({}, state.plan, {
            routes: mapData.plan.routes.filter(
              (route) => route.id === filters['planRouteDetailsById']
            ),
          }),
        }),
      routes: (state: stateTypes.MapDataState) =>
        Object.assign({}, state, {
          plan: Object.assign({}, state.plan, {
            routes: mapData.plan.routes,
          }),
        }),
      transportDetailsById: (state: stateTypes.MapDataState) =>
        Object.assign({}, state, {
          transports: mapData.transports.filter(
            (transport) => transport.id === filters.transportDetailsById
          ),
        }),
    }),
    [filters, mapData.bookings, mapData.plan, mapData.transports]
  )

  return React.useMemo(() => {
    const activeFilters = Object.entries(filters)
      .filter(([_, val]) => val)
      .map(([key]) => key)

    const filtersToApply = Object.entries(filterFunctions)
      .filter(([name]) => activeFilters.includes(name))
      .map(([_, fn]) => fn)

    return filtersToApply.reduce(
      (accumulator, fn) => fn(accumulator),
      stores.mapDataInitialState
    )
  }, [filterFunctions, filters])
}

const useMapLayers = (
  data: stateTypes.MapDataState,
  handleClick: (event: any) => void
) => {
  const [UIState] = stores.ui((state) => [state, state.dispatch])

  const layers = React.useMemo(() => {
    console.log('running')
    return [
      mapUtils.toGeoJsonLayer(
        'geojson-bookings-layer',
        mapUtils.bookingToFeature(data.bookings),
        handleClick
      ),
      mapUtils.toGeoJsonLayer(
        'geojson-plan-layer',
        mapUtils.planToFeature(data.plan.routes),
        handleClick
      ),
      mapUtils.toGeoJsonLayer(
        'geojson-transport-layer',
        mapUtils.planToFeature(data.transports),
        handleClick
      ),
      ...data.plan.routes
        .map((route) =>
          mapUtils.toBookingIconLayer(
            mapUtils.routeActivityIcon(route),
            UIState.highlightBooking,
            { offset: [40, 0] }
          )
        )
        .concat(
          data.plan.excludedBookings.map((b) =>
            mapUtils.toExcludedBookingIcon(b, UIState.highlightBooking)
          )
        ),

      mapUtils.toTextLayer(mapUtils.routeActivitiesToFeature(data.plan.routes)),
      mapUtils.toTransportIconLayer(
        mapUtils.transportIcon(data.transports),
        UIState.highlightTransport
      ),
      mapUtils.toBookingIconLayer(
        mapUtils.bookingIcon(data.bookings),
        UIState.highlightBooking
      ),
    ]
  }, [
    UIState.highlightBooking,
    UIState.highlightTransport,
    data.bookings,
    data.plan.excludedBookings,
    data.plan.routes,
    data.transports,
    handleClick,
  ])

  return layers
}

const Map: React.FC<{}> = () => {
  const [viewState, setViewState] = stores.map((state) => [state, state.set])
  const [UIState, setUIState] = stores.ui((state) => [state, state.dispatch])
  const history = useHistory()

  const handleDragEvent = () =>
    UIState.showMapTooltip && setUIState({ type: 'hideTooltip' })

  const handleClick = React.useCallback(
    (event: any) => {
      if (!event.object) return
      const type = event.object.properties.type
      switch (type) {
        case 'booking':
          return history.push(`/bookings/${event.object.id}`)
        case 'plan':
          return history.push(`/transports/${event.object.id}`)
        default:
          return
      }
    },
    [history]
  )

  const mapData = useMapDataWithFilters()
  const layers = useMapLayers(mapData, handleClick)

  const onMapClick = ({
    lngLat: [lon, lat],
    x,
    y,
  }: {
    lngLat: [lon: number, lat: number]
    x: number
    y: number
  }) =>
    setUIState({
      type: 'lastClickedPosition',
      payload: { lat, lon, x, y },
    })

  return (
    <>
      <DeckGL
        layers={layers}
        controller={true}
        onClick={(e: any) => {
          onMapClick(e)
          handleClick(e)
        }}
        viewState={viewState as any}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        onDrag={handleDragEvent}
      >
        <StaticMap
          preventStyleDiffing
          reuseMaps
          width="100%"
          height="100%"
          mapStyle="mapbox://styles/mapbox/dark-v10"
        />
      </DeckGL>
      {UIState.showMapTooltip && (
        <Tooltip position={UIState.lastClickedPosition} />
      )}
    </>
  )
}

export default Map
