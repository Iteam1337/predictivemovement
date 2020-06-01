import { useLocation } from 'react-router-dom'

const useFilteredStateFromQueryParams = (state) => {
  const useQueryParams = () => new URLSearchParams(useLocation().search)
  const type = useQueryParams().get('type')
  const id = useQueryParams().get('id')
  const status = useQueryParams().get('status')

  const statuses = status ? status.split(',') : []

  return {
    type,
    id,
    data: {
      ...state,
      bookings: state.bookings
        .filter((item) => (type === 'booking' ? item.id === id : true))
        .filter((item) =>
          statuses.length ? statuses.includes(item.status) : true
        ),
      cars: state.cars.filter((item) =>
        type === 'car' ? item.id.toString() === id : true
      ),
    },
  }
}

export default { useFilteredStateFromQueryParams }
