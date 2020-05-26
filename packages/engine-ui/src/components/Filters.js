import React from 'react'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'


const Filters = () => {
  const [showAssigned, setShowAssigned] = React.useState(true)

  const handleChange = (event) => {
    setShowAssigned(event.target.checked)
  }
  
  return <>
    <h3>Filters</h3>
    <FormControlLabel control={<Checkbox
      checked={showAssigned}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'primary checkbox' }}
    />}
    value="top"
    label="Assigned"
    labelPlacement="left"
    />
    
  </>
}

export default Filters