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
    case 'setBookings':
      const newState = state.bookingCollection.features.concat(action.payload)

      return {
        ...state,
        bookingCollection: {
          ...state.bookingCollection,
          features: newState,
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
  bookingCollection: featureCollection,
  carInfo: {},
}
