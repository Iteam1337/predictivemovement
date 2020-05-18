export const reducer = (state, action) => {
  switch (action.type) {
    case 'setCars':
      return {
        ...state,
        carCollection: {
          ...state.carCollection,
          features: action.payload,
        },
      }
    case 'setMovingCars':
      return {
        ...state,
        movingCarsCollection: action.payload,
      }
    case 'setCarBookingLines':
      return {
        ...state,
        carBookingLineCollection: action.payload,
      }
    case 'setCarBookingLine':
      return {
        ...state,
        carBookingLine: state.carBookingLineCollection.filter(
          (line) => line.id === action.payload
        ),
      }
    case 'setBookings':
      const newState = state.bookingCollection.features.concat(action.payload)

      return {
        ...state,
        bookingCollection: {
          ...state.bookingCollection,
          features: newState,
        },
      }
    case 'removeBookings':
      const filtered = state.bookingCollection.features.filter(
        (x) => !action.payload.some((i) => i.id === x.id)
      )

      return {
        ...state,
        bookingCollection: {
          ...state.bookingCollection,
          features: filtered,
        },
      }
    case 'setCarsLines':
      return {
        ...state,
        carLineCollection: {
          ...state.carLineCollection,
          features: action.payload,
        },
      }
    case 'setCarInfo':
      console.log('setCarInfo', action.payload)
      return {
        ...state,
        carInfo: {
          ...action.payload,
        },
      }
    default:
      return state
  }
}

const featureCollection = {
  type: 'FeatureCollection',
  features: [],
}

export const initState = {
  carCollection: featureCollection,
  movingCarsCollection: featureCollection,
  carLineCollection: featureCollection,
  carBookingLineCollection: [],
  carBookingLine: {},
  bookingCollection: featureCollection,
  carInfo: {},
}
