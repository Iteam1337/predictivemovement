import styled from 'styled-components'

const TimeRestrictionDateInputWrapper = styled.div`
  margin-bottom: 0.25rem;
`

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

const BookingList = styled.ul`
  padding: 0;
  margin: 0;
  display: flex;
  flex-flow: column nowrap;
  list-style: none;
  padding-top: 1rem;
  li:not(:last-child) {
    margin-bottom: 0.875rem;
  }
`

const Container = styled.div`
  margin-bottom: 2rem;
  margin-left: 1rem;
`

const MarginBottomContainer = styled.div`
  margin-bottom: 3rem;
`

const MarginTopContainer = styled.div`
  margin-top: 2rem;
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

export default {
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
}
