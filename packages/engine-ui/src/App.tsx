import React from 'react'
import { useSocket } from 'use-socketio'
import Sidebar from './components/Sidebar'
import 'mapbox-gl/dist/mapbox-gl.css'

import { Route, useRouteMatch } from 'react-router-dom'
import Map from './components/Map'
import Logotype from './components/Logotype'

import Notifications from './components/Notifications'
import * as notificationTypes from './notificationTypes'
import * as mapUtils from './utils/mapUtils'
import * as stores from './utils/state/stores'
import { getColor } from './utils/palette'

const App = () => {
  const { socket } = useSocket()
  // const [state, dispatch] = React.useReducer(reducer, initState)
  // const { data: mapData } = hooks.useFilteredStateFromQueryParams(state)
  const [notifications, updateNotifications] = React.useState<
    notificationTypes.Notification[]
  >([])

  const setDataState = stores.dataState(
    React.useCallback((state) => state.set, [])
  )

  const mapLayersState = stores.mapLayerState(
    React.useCallback((state) => state, [])
  )

  const isMobile = window.innerWidth <= 645

  const createTransport = (params: any) => {
    socket.emit('create-transport', params)
  }

  const createBooking = (params: any) => {
    socket.emit('new-booking', params)
  }

  const dispatchOffers = () => {
    socket.emit('dispatch-offers')
  }

  const deleteBooking = (id: string) => {
    socket.emit('delete-booking', id)
  }

  const deleteTransport = (id: string) => {
    socket.emit('delete-transport', id)
  }

  const moveBooking = (bookingId: string, transportId: string) => {
    socket.emit('move-booking', { bookingId, transportId })
  }

  const updateBooking = (booking: any) => {
    socket.emit('update-booking', booking)
  }

  useSocket('notification', (data: notificationTypes.Notification) => {
    updateNotifications((notifications) => notifications.concat(data))
  })

  useSocket('bookings', (bookings) => {
    setDataState({ bookings })
  })

  useSocket('delete-booking', (bookingId) => {
    // dispatch({
    //   type: 'deleteBooking',
    //   payload: bookingId,
    // })
  })

  useSocket('transport-updated', (msg) => {
    // dispatch({
    //   type: 'updateTransport',
    //   payload: msg,
    // })
  })

  useSocket('transport-deleted', (transportId) => {
    // dispatch({
    //   type: 'deleteTransport',
    //   payload: transportId,
    // })
  })

  useSocket('transports', (newTransports) => {
    setDataState({
      transports: newTransports.map((v: any, i: number) => ({
        ...v,
        color: getColor(i, 0),
      })),
    })
  })

  useSocket('plan-update', (plan) => {
    // dispatch({
    //   type: 'setPlan',
    //   payload: {
    //     routes: plan.transports,
    //     excludedBookings: plan.excludedBookingIds,
    //   },
    // })
  })

  const handleClickEvent = (event: any) => {
    if (!event.object) {
      const {
        lngLat: [lon, lat],
        x,
        y,
      } = event
      return setUIState({
        type: 'lastClickedPosition',
        payload: { lat, lon, x, y },
      })
    }

    // hideTooltip()
    const type = event.object.properties?.type

    if (!type) {
      return
    }

    const id = event.object.id || event.object.properties.id
    switch (type) {
      case 'booking':
      // return history.push(`/bookings/${id}`)
      case 'transport':
      case 'plan':
      // return history.push(`/transports/${id}`)
      default:
        return
    }
  }

  const [UIState, setUIState] = stores.ui((state) => [state, state.dispatch])
  const showTextLayer = useRouteMatch({
    path: ['/plans/routes/:routeId'],
  })

  const layers = [
    mapUtils.toGeoJsonLayer(
      'geojson-bookings-layer',
      mapUtils.bookingToFeature(mapLayersState.bookings),
      handleClickEvent
    ),
    // mapUtils.toGeoJsonLayer(
    //   'geojson-plan-layer',
    //   mapUtils.planToFeature(mapLayersState.plan.routes, state.transports),
    //   handleClickEvent
    // ),
    mapUtils.toGeoJsonLayer(
      'geojson-transport-layer',
      mapUtils.planToFeature(mapLayersState.transports),

      handleClickEvent
    ),
    mapLayersState.plan.routes
      .map((route) =>
        mapUtils.toBookingIconLayer(
          route.activities?.slice(1, -1),
          'address',
          UIState.highlightBooking,
          { offset: [40, 0] }
        )
      )
      .concat(
        mapLayersState.plan.excludedBookings.map((b) =>
          mapUtils.toExcludedBookingIcon(b, UIState.highlightBooking)
        )
      ),
    showTextLayer &&
      mapUtils.toTextLayer(
        mapUtils.routeActivitiesToFeature(mapLayersState.plan.routes)
      ),
    mapUtils.toTransportIconLayer(
      mapLayersState.transports,
      UIState.highlightTransport
    ),
    mapUtils.toIconClusterLayer({
      type: 'bookings',
      data: mapLayersState.bookings.flatMap(({ id, pickup }) => ({
        coordinates: [pickup.lon, pickup.lat],
        active: id === UIState.highlightBooking,
      })),
      properties: {},
    }),
  ]

  return (
    <>
      {!isMobile && <Logotype />}
      <Notifications
        notifications={notifications}
        updateNotifications={updateNotifications}
      />
      <Sidebar
        isMobile={isMobile}
        createBooking={createBooking}
        dispatchOffers={dispatchOffers}
        createTransport={createTransport}
        deleteBooking={deleteBooking}
        deleteTransport={deleteTransport}
        moveBooking={moveBooking}
        updateBooking={updateBooking}
      />
      {!isMobile && (
        <Route path="/">
          <Map layers={layers} state={{}} />
        </Route>
      )}
    </>
  )
}

export default App
