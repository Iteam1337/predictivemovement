import { blue, grey } from '@material-ui/core/colors'
import { withStyles } from '@material-ui/core/styles'
import MaterialSwitch from '@material-ui/core/Switch'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const FlexRowWrapper = styled.div`
  display: flex;
  align-items: baseline;
`

const LinkListContainer = styled.div`
  a:not(:first-child) {
    margin-top: 0.5rem;
  }
  display: flex;
  flex-direction: column;
`

const NoInfoParagraph = styled.p`
  font-style: italic;
  font-size: 0.875rem;
`

const Container = styled.div`
  margin-bottom: 2rem;
`

const InputContainer = styled.div`
  margin-bottom: 1rem;
`

const InputInnerContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`

const RoundedLink = styled(Link)`
  background: #e6ffe6;
  border-radius: 0.75rem;
  padding: 0.5rem 0.6rem;
  text-decoration: none;
  display: inline-block;
  font-size: 0.875rem;
  width: fit-content;
  color: black;
  :visited {
    color: black;
  }
  :hover {
    background: #ccffcc;
  }
  margin: ${({ margin }) => margin && margin};
`

const TextInput = styled.input`
  border: none;
  background-color: #f1f3f5;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  border-radius: 0.25rem;
  width: 100%;
  font-size: 0.875rem;
  padding-left: 2.5rem;
`

const Label = styled.label`
  margin-bottom: 0.5rem;
  display: block;
  font-weight: bold;
  font-size: 0.875rem;
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

const SubmitButton = styled.button`
  padding: 0.75rem 2.3rem;
  background: #ccffcc;
  font-weight: 600;
  color: inherit;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;

  :hover {
    background: #ccffcc;
    color: #666666;
  }
`
const CancelButton = styled.button`
  padding: 0.75rem 2.3rem;
  background: #fff;
  font-weight: 600;
  color: inherit;
  font-size: 0.875rem;
  border: 1px solid #c4c4c4;
  cursor: pointer;

  :hover {
    color: #666666;
  }
`

const LocationIcon = styled.img`
  width: 16px;
  height: 18px;
  position: absolute;
  top: 12px;
  left: 12.5px;
`
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
  track: {
    backgroundColor: grey[400],
  },
})(MaterialSwitch)

export default {
  StrongParagraph,
  Switch,
  Container,
  InputContainer,
  InputInnerContainer,
  TextInput,
  Label,
  ButtonWrapper,
  SubmitButton,
  CancelButton,
  LocationIcon,
  FlexRowWrapper,
  RoundedLink,
  LinkListContainer,
  NoInfoParagraph,
}
