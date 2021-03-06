import styled from 'styled-components'

const TimeRestrictionDateInputWrapper = styled.div``

const FlexRowWrapper = styled.div`
  display: flex;
  align-items: baseline;
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

const FlexRowInCenterMarginS = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: center;
`

const FlexRowInCenterMarginL = styled.div`
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
  padding-top: 0;
  height: auto;
`

const Container = styled.div`
  margin-bottom: 2rem;
  margin-left: 1rem;

  @media (max-width: 645px) {
    margin-left: 0rem;
  }
`

const ContainerWidth = styled.div`
  margin-bottom: 2rem;
  margin-left: 1rem;
  width: 300px;

  @media (max-width: 645px) {
    margin-left: 0rem;
    width: 100%;
  }
`

const FlexRowBaselineContainer = styled.div`
  display: flex;
  align-items: baseline;
`

const FlexContainer = styled.div`
  display: flex;
`

const MarginBottomContainer = styled.div`
  margin-bottom: 2rem;
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
  width: inherit;
`

const TextInputPairContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

const TextInputPairItem = styled.div`
  width: 48.5%;
`

const ButtonWrapper = styled.div<{
  marginTop?: string
  justifyContent?: string
}>`
  display: flex;
  flex-direction: row;
  justify-content: ${({ justifyContent }) =>
    justifyContent ? justifyContent : 'space-between'};
  margin-top: ${({ marginTop }) => (marginTop ? marginTop : '2rem')};
  width: 100%;

  button {
    width: 48.5%;
  }
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
  FlexRowInCenterMarginL,
  FlexRowInCenterMarginS,
  FlexContainer,
  ContainerWidth,
}
