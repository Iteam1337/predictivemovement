import styled from 'styled-components'

const TimeRestrictionDateInputWrapper = styled.div``

const FlexRowWrapper = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  height: 50px;
`
const SectionWithMargin = styled.section`
  margin: 1.2rem 0;
`
const LinkListContainer = styled.div`
  a:not(:first-child) {
    margin-top: 0.5rem;
  }
  display: flex;
  flex-direction: column;
`

const FlexRowInCenter = styled.div`
  margin-top: 5rem;
  display: flex;
  justify-content: center;
`
const BookingList = styled.ul`
  overflow: auto;
  height: 100%;
  padding: 0;
  margin: 0;
  display: flex;
  flex-flow: column nowrap;
  list-style: none;
  padding-top: 1rem;
  li:not(:last-child) {
    margin-bottom: 0.5rem;
  }
`

const TransportsList = styled(BookingList)`
  height: auto;
`

const Container = styled.div`
  margin-bottom: 2rem;
  margin-left: 1rem;
`

const FlexRowBaselineContainer = styled.div`
  display: flex;
  align-items: baseline;
`
const MarginBottomContainer = styled.div`
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const InlineContainer = styled.div`
  * {
    display: inline;
  }
`

const MarginTopContainerSm = styled.div`
  margin-top: 1rem;
`

const MarginTopContainer = styled.div<{
  alignItems?: string
  marginTop?: string
}>`
  margin-top: ${({ marginTop }) => marginTop || '2rem'};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  align-items: ${({ alignItems }) => alignItems && alignItems};
`

const MarginLeftContainerSm = styled.div`
  margin-left: 1rem;
`

const InputInnerContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`

const InputBlock = styled.div`
  margin-bottom: 1.25rem;
`

const InputContainer = styled.div`
  margin-bottom: 0.5rem;
`

const TextInputPairContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

const TextInputPairItem = styled.div`
  width: 48.5%;
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`

const TimeRestrictionWrapper = styled.div`
  .react-datepicker-wrapper {
    width: 100%;
  }
`

export {
  InputBlock,
  InputContainer,
  FlexRowWrapper,
  LinkListContainer,
  TimeRestrictionDateInputWrapper,
  Container,
  InputInnerContainer,
  TextInputPairContainer,
  TextInputPairItem,
  ButtonWrapper,
  TimeRestrictionWrapper,
  BookingList,
  MarginBottomContainer,
  MarginTopContainer,
  MarginLeftContainerSm,
  InlineContainer,
  FlexRowBaselineContainer,
  SectionWithMargin,
  MarginTopContainerSm,
  TransportsList,
  FlexRowInCenter
}
