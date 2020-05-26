import styled from 'styled-components'

import MaterialSwitch from '@material-ui/core/Switch'
import { blue } from '@material-ui/core/colors'

import { withStyles } from '@material-ui/core/styles'

const StrongParagraph = styled.label`
  margin-bottom: 0.5rem;
  display: block;
  font-weight: bold;
`

const Switch = withStyles({
  switchBase: {
    color: blue[300],
    '&$checked': {
      color: blue[500],
    },
    '&$checked + $track': {
      backgroundColor: blue[500],
    },
  },
  checked: {},
  track: {},
})(MaterialSwitch)

export default { StrongParagraph, Switch }
