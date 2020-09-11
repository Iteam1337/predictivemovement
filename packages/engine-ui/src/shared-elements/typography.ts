import styled from 'styled-components'

const NoInfoParagraph = styled.p`
  font-style: italic;
  font-size: 0.875rem;
  margin: 0;
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

const NoMarginParagraph = styled.p`
  margin: 0;
`

const CleanH4 = styled.h4`
  margin: 0;
  cursor: default;
`

const RoundedLabelDisplay = styled.span<{ margin: string }>`
  background: #e6ffe6;
  border-radius: 0.75rem;
  padding: 0.5rem 0.6rem;
  text-decoration: none;
  display: inline-block;
  font-size: 0.875rem;
  width: fit-content;
  color: black;
  margin: ${({ margin }) => margin && margin};
`

export default {
  NoInfoParagraph,
  NoMarginParagraph,
  SmallInfo,
  StrongParagraph,
  RoundedLabelDisplay,
  CleanH4,
}
