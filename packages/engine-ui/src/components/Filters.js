
import React from 'react'

import { useHistory } from 'react-router-dom'
import Elements from './Elements'
import styled from 'styled-components'

const Container = styled.div`
  margin-top: 1.5rem;
`

const Filters = () => {
  const [filters, setFilters] = React.useState({ status: [] })

  const history = useHistory()
  React.useEffect(() => {
    const params = Object.entries(filters).reduce((prev, [key, val]) => {
      if (!val.length) return prev

      return `${prev && prev + '&'}${key}=${val.join(',')}`
    }, '')

    params !== '' ? history.push(`?${params}`) : history.push('')
  }, [filters, history])

  // eslint-disable-next-line no-unused-vars
  const handleChange = (type, filter) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [type]: currentFilters[type].includes(filter)
        ? [...currentFilters[type].filter((x) => x !== filter)]
        : [...currentFilters[type], filter],
    }))
  }

  return (
    <Container>
      <Elements.Checkbox/>
    </Container>
  )
}

export default Filters
