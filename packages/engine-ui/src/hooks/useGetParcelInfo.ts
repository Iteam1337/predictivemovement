import React from 'react'
import { useSocket } from 'use-socketio'

const useGetParcelInfo = (initialState = []) => {
  const { socket } = useSocket()
  const [suggested] = React.useState(initialState)

  const find = (query: string) => {
    socket.emit('search-parcel', query)
  }

  return [find, suggested]
}

export default useGetParcelInfo
