import React from 'react'
import { FlyToInterpolator } from 'react-map-gl'

export const ViewportContext = React.createContext()

export const ViewportProvider = (props) => {
  const [viewport, setViewport] = React.useState(INITIAL_STATE)

  const onLoad = () => {
    setViewport(DRC_MAP)
  }

  return (
    <ViewportContext.Provider
      value={{
        viewport,
        setViewport,
        onLoad,
      }}
      {...props}
    />
  )
}

const INITIAL_STATE = {
  latitude: 61.8294959,
  longitude: 16.0740589,
  zoom: 8,
}

export const DRC_MAP = {
  latitude: 61.8294959,
  longitude: 16.0740589,
  zoom: 10,
  transitionDuration: 3000,
  transitionInterpolator: new FlyToInterpolator(),
  transitionEasing: (t) => t * (2 - t),
}
