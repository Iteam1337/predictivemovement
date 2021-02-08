import React, { SetStateAction } from 'react'
import { FormState as CreateTransportState } from '../components/CreateTransport'
import { FormBooking } from '../components/EditBooking/EditBooking'
import * as stores from '../utils/state/stores'

const useFormStateWithMapClickControl = <
  T extends CreateTransportState | FormBooking
>(
  start: string,
  end: string,
  set: (callback: SetStateAction<T>) => void
) => {
  const [UIState, setUIState] = stores.ui((state) => [state, state.dispatch])

  React.useEffect(() => {
    /**
     * Listen for a combination of clicks on an
     * input field and on the map.
     * When this happens, set pickup/delivery input
     * to name of address clicked on map.
     */

    if (UIState.lastFocusedInput && UIState.lastClickedPosition.address) {
      const { address, lat, lon } = UIState.lastClickedPosition
      const formattedAddress = `${address.name}, ${address.county}`

      switch (UIState.lastFocusedInput) {
        case 'start':
          set((current) => ({
            ...current,
            [start]: {
              ...current[start],
              name: formattedAddress,
              street: address.name,
              city: address.county,
              lat,
              lon,
            },
          }))
          break

        case 'end':
          set((current) => ({
            ...current,
            [end]: {
              ...current[end],
              name: formattedAddress,
              street: address.name,
              city: address.county,
              lat,
              lon,
            },
          }))
          break

        default:
          break
      }

      return setUIState({ type: 'resetInputClickState' })
    }
  }, [
    setUIState,
    UIState.lastClickedPosition,
    UIState.lastFocusedInput,
    set,
    start,
    end,
  ])

  React.useEffect(() => {
    return () => setUIState({ type: 'resetInputClickState' })
  }, [setUIState])
}

export default useFormStateWithMapClickControl
