import React from 'react'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { useHistory } from 'react-router-dom'
import Elements from './Elements'

const Filters = () => {
  const [filters, setFilters] = React.useState({ status: [] })

  const history = useHistory()
  React.useEffect(() => {
    const params = Object.entries(filters).reduce((prev, [key, val]) => {
      if (!val.length) return prev

      return `${prev}${prev && '&'}${key}=${val.join(',')}`
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
    <>
      <Elements.StrongParagraph>Filter</Elements.StrongParagraph>
      <FormControlLabel
        control={
          <Checkbox
            checked={filters.status.includes('assigned')}
            onChange={() => handleChange('status', 'assigned')}
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
        }
        value="top"
        label="Assigned"
        labelPlacement="end"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={filters.status.includes('new')}
            onChange={() => handleChange('status', 'new')}
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
        }
        value="top"
        label="New"
        labelPlacement="end"
      />
    </>
  )
}

export default Filters
