import React from 'react'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
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
      <Elements.StrongParagraph>Filtrera</Elements.StrongParagraph>
      <FormControlLabel
        control={
          <Checkbox
            checked={filters.status.includes('new')}
            onChange={() => handleChange('status', 'new')}
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
        }
        value="top"
        label={<Elements.FormLabel>Nya</Elements.FormLabel>}
        labelPlacement="end"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={filters.status.includes('assigned')}
            onChange={() => handleChange('status', 'assigned')}
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
        }
        value="top"
        label={<Elements.FormLabel>Tilldelade</Elements.FormLabel>}
        labelPlacement="end"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={filters.status.includes('delivered')}
            onChange={() => handleChange('status', 'delivered')}
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
        }
        value="top"
        label={<Elements.FormLabel>Levererade</Elements.FormLabel>}
        labelPlacement="end"
      />
    </Container>
  )
}

export default Filters
