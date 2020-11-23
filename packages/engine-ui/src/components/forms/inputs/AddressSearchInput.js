import React from 'react'
import * as Elements from '../../../shared-elements'
import locationIcon from '../../../assets/location.svg'
import styled from 'styled-components'
import * as hooks from '../../../utils/hooks'
import debounce from 'lodash.debounce'
import warningIcon from '../../../assets/warning.svg'

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

const Component = ({
  onChangeHandler,
  placeholder,
  value,
  formError,
  ...rest
}) => {
  const getFavoriteAddresses = () => {
    let favoriteAddresses

    try {
      favoriteAddresses =
        JSON.parse(localStorage.getItem('favoriteAddresses')) || []
    } catch (ex) {
      favoriteAddresses = []
    }

    return favoriteAddresses
  }

  const isFavorite = (name) => {
    return getFavoriteAddresses().some((a) => a.name === name)
  }

  const [showDropdown, setShowDropdown] = React.useState(false)
  const [showSaveFavorite, setShowSaveFavorite] = React.useState(false)
  const [search, suggestedAddresses] = hooks.useGetSuggestedAddresses(
    getFavoriteAddresses()
  )

  const [selectedAddress, setSelectedAddress] = React.useState({})

  const searchWithDebounce = React.useMemo(
    () => debounce((q) => search(q, () => setShowDropdown(true)), 300),
    [search]
  )

  const onSearchInputHandler = (event) => {
    event.persist()
    setShowSaveFavorite(false)
    searchWithDebounce(event.target.value)

    return onChangeHandler({ name: event.target.value })
  }

  const handleDropdownSelect = (event, address) => {
    event.persist()
    setShowDropdown(false)
    setShowSaveFavorite(!isFavorite(address.name))
    const selected = {
      ...address,
      name: `${address.name}, ${address.county}`,
      street: address.name,
    }
    setSelectedAddress(address)
    return onChangeHandler(selected)
  }

  const saveAsFavorite = () => {
    const favoriteAddresses = getFavoriteAddresses()

    if (isFavorite(selectedAddress.name)) return false

    const displayName = prompt(
      'Namn på denna favoritposition',
      `${selectedAddress.name}, ${selectedAddress.county}`
    )
    if (!displayName) return false
    selectedAddress.displayName = displayName

    localStorage.setItem(
      'favoriteAddresses',
      JSON.stringify(favoriteAddresses.concat([selectedAddress]))
    )

    setShowSaveFavorite(false)
  }

  return (
    <Elements.Layout.InputInnerContainer>
      {formError ? (
        <Elements.Icons.FormInputIcon
          alt="Warning icon"
          src={`${warningIcon}`}
        />
      ) : (
        <Elements.Icons.FormInputIcon
          alt="Location pickup icon"
          src={`${locationIcon}`}
        />
      )}
      <Elements.Form.TextInput
        {...rest}
        error={formError}
        name="pickup"
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={onSearchInputHandler}
        onFocus={() => setShowDropdown(getFavoriteAddresses().length > 0)}
        onBlur={() => {
          setShowDropdown(false)
        }}
        iconInset
      />

      {showDropdown && (
        <DropdownWrapper>
          {suggestedAddresses.map((address, index) => (
            <DropdownButton
              key={index}
              name={address.name}
              onMouseDown={(event) => handleDropdownSelect(event, address)}
            >
              {address.displayName}
            </DropdownButton>
          ))}
        </DropdownWrapper>
      )}

      {showSaveFavorite && (
        <Elements.Buttons.CancelButton
          padding="0.5rem"
          style={{
            marginTop: '0.5rem',
          }}
          onClick={saveAsFavorite}
        >
          Spara som favoritposition
        </Elements.Buttons.CancelButton>
      )}
    </Elements.Layout.InputInnerContainer>
  )
}

export default Component
