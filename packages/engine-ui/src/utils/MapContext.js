import React from 'react'
import { FlyToInterpolator } from 'react-map-gl'

export const MapContext = React.createContext()

const reducer = (state, action) => {
  switch (action.type) {
    case 'viewport':
      return { ...state, viewport: action.payload }
    default:
      return state
  }
}

export const MapStateProvider = (props) => {
  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE)

  const onLoad = () => {
    dispatch('viewport', INITIAL_STATE.viewport)
  }

  return (
    <MapContext.Provider
      value={{
        state,
        dispatch,
        onLoad,
      }}
      {...props}
    />
  )
}

const INITIAL_STATE = {
  viewport: {
    latitude: 61.8294959,
    longitude: 16.0740589,
    zoom: 10,
    transitionDuration: 3000,
    transitionInterpolator: new FlyToInterpolator(),
    transitionEasing: (t) => t * (2 - t),
  },
}
