import { useLocation } from 'react-router-dom'

const useFilteredStateFromQueryParams = (state) => {
  const useQueryParams = () => new URLSearchParams(useLocation().search)
  const type = useQueryParams().get('type')
  const id = useQueryParams().get('id')

  if (!type) return { data: state }

  return {
    type,
    id,
    data:
      type === 'booking'
        ? {
            ...state,
            bookings: state.bookings.filter((item) => item.id === id),
          }
        : {
            ...state,
            cars: state.cars.filter((item) => item.id.toString() === id),
          },
  }
}

export default { useFilteredStateFromQueryParams }
