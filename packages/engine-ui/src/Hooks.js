import { useLocation } from 'react-router-dom'

const useFilteredStateFromQueryParams = (state) => {
  const useQueryParams = () => new URLSearchParams(useLocation().search)
  const type = useQueryParams().get('type')
  const id = useQueryParams().get('id')

  return {
    type,
    id,
    data:
      type === 'booking'
        ? state.bookings.find((item) => item.id === id)
        : state.cars.find((item) => item.id.toString() === id),
  }
}

export default { useFilteredStateFromQueryParams }
