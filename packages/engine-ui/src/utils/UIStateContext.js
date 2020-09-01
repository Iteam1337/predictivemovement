import React from 'react'
import { FlyToInterpolator } from 'react-map-gl'

export const UIStateContext = React.createContext()

const reducer = (state, action) => {
  switch (action.type) {
    case 'viewport':
      return { ...state, viewport: action.payload }
    case 'highlightBooking':
      return { ...state, highlightBooking: action.payload }
    case 'highlightVehicle':
      return { ...state, highlightVehicle: action.payload }
    case 'lastClickedPosition':
      return {
        ...state,
        lastClickedPosition: action.payload,
      }
    default:
      return state
  }
}

export const UIStateProvider = (props) => {
  const [state, dispatch] = React.useReducer(reducer, INITIAL_STATE)

  const onLoad = () => {
    dispatch('viewport', INITIAL_STATE.viewport)
  }

  return (
    <UIStateContext.Provider
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
  highlightBooking: undefined,
  lastClickedPosition: { lat: null, lon: null },
}
