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

const Container = styled.div`
  margin-bottom: 2rem;
  margin-left: 1rem;
`

const InputInnerContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
`

const InputBlock = styled.div`
  margin-bottom: 1rem;
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
}
