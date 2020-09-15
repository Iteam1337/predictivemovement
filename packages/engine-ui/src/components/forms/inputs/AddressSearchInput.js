import React from 'react'
import Elements from '../../Elements'
import locationIcon from '../../../assets/location.svg'
import styled from 'styled-components'
import hooks from '../../../utils/hooks'
import debounce from 'lodash.debounce'

const DropdownWrapper = styled.div`
  width: 100%;
  z-index: 1;
  position: absolute;
`

const DropdownButton = styled.button`
  width: inherit;
  text-align: left;
  padding: 0.5rem;
  border: 1px solid grey;
  :focus {
    outline-color: #13c57b;
  }
`

const Component = ({ onChangeHandler, placeholder, value, ...rest }) => {
  const [showDropdown, setShowDropdown] = React.useState(false)
  const [search, suggestedAddresses] = hooks.useGetSuggestedAddresses([])

  const searchWithDebounce = React.useCallback(
    debounce((q) => search(q, () => setShowDropdown(true)), 300),
    []
  )

  const onSearchInputHandler = (event) => {
    event.persist()
    searchWithDebounce(event.target.value)

    return onChangeHandler({ name: event.target.value })
  }

  const handleDropdownSelect = (event, address) => {
    event.persist()
    setShowDropdown(false)

    return onChangeHandler({
      ...address,
      name: `${address.name}, ${address.county}`,
    })
  }

  return (
    <Elements.InputInnerContainer>
      <Elements.FormInputIcon
        alt="Location pickup icon"
        src={`${locationIcon}`}
      />
      <Elements.TextInput
        {...rest}
        name="pickup"
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={onSearchInputHandler}
        iconInset
      />

      {showDropdown && (
        <DropdownWrapper>
          {suggestedAddresses.map((address, index) => (
            <DropdownButton
              key={index}
              name={address.name}
              onClick={(event) => handleDropdownSelect(event, address)}
            >
              {address.name}, {address.county}
            </DropdownButton>
          ))}
        </DropdownWrapper>
      )}
    </Elements.InputInnerContainer>
  )
}

export default Component
