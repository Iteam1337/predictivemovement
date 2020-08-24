import styled from 'styled-components'

const NoInfoParagraph = styled.p`
  font-style: italic;
  font-size: 0.875rem;
`

const SmallInfo = styled.p`
  font-style: italic;
  font-size: 0.75rem;
  margin-top: 0;
  margin-bottom: 0.25rem;
`

const StrongParagraph = styled.label`
  margin-bottom: 0.5rem;
  display: block;
  font-weight: bold;
`

export default { NoInfoParagraph, SmallInfo, StrongParagraph }
