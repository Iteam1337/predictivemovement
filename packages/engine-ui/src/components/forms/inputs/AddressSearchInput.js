import React from 'react'
import Elements from '../../Elements'
import locationIcon from '../../../assets/location.svg'
import styled from 'styled-components'
import hooks from '../../../utils/hooks'

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

const Component = ({ onChangeHandler, placeholder }) => {
  const [showDropdown, setShowDropdown] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [search, suggestedAddresses] = hooks.useGetSuggestedAddresses([])

  const onSearchInputHandler = (event) => {
    event.persist()
    search(event.target.value, () => setShowDropdown(true))

    return setQuery(event.target.value)
  }

  const handleDropdownSelect = (event, address) => {
    event.persist()
    setQuery(address.name)
    setShowDropdown(false)

    return onChangeHandler(address)
  }

  return (
    <Elements.InputInnerContainer>
      <Elements.FormInputIcon
        alt="Location pickup icon"
        src={`${locationIcon}`}
      />
      <Elements.TextInput
        name="pickup"
        type="text"
        value={query}
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
              {address.name}
            </DropdownButton>
          ))}
        </DropdownWrapper>
      )}
    </Elements.InputInnerContainer>
  )
}

export default Component
