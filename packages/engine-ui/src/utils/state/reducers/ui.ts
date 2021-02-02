import * as types from '../../../types/state'

const reducer = (state: types.UIState, action: types.UIStateReducerAction) => {
  switch (action.type) {
    case 'focusInput':
      return { ...state, lastFocusedInput: action.payload }
    case 'resetInputClickState':
      return {
        ...state,
        lastClickedPosition: {
          x: undefined,
          y: undefined,
          lat: undefined,
          lon: undefined,
          address: undefined,
        },
        showMapTooltip: false,
        lastFocusedInput: undefined,
      }
    case 'highlightBooking':
      return { ...state, highlightBooking: action.payload }
    case 'highlightTransport':
      return { ...state, highlightTransport: action.payload }
    case 'lastClickedPosition':
      return {
        ...state,
        showMapTooltip: true,
        lastClickedPosition: {
          ...state.lastClickedPosition,
          ...action.payload,
        },
      }
    case 'addAddressToLastClickedPosition':
      return {
        ...state,
        lastClickedPosition: {
          ...state.lastClickedPosition,
          address: action.payload,
        },
      }
    case 'hideTooltip':
      return { ...state, showMapTooltip: false }
    default:
      return state
  }
}

export default reducer
