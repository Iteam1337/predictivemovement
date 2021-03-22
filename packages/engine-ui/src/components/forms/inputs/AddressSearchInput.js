import React from 'react'
import * as Elements from '../../../shared-elements'
import locationIcon from '../../../assets/location.svg'
import * as hooks from '../../../hooks'
import debounce from 'lodash.debounce'
import warningIcon from '../../../assets/warning.svg'

const Component = ({
  onChangeHandler,
  onFocusHandler,
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

  const isFavorite = (name, county) => {
    return getFavoriteAddresses().some(
      (a) => a.name === name && a.county === county
    )
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
    setShowSaveFavorite(!isFavorite(address.name, address.county))
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
    if (isFavorite(selectedAddress.name, selectedAddress.county)) return false

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
        onFocus={() => {
          setShowDropdown(getFavoriteAddresses().length > 0)
          return onFocusHandler()
        }}
        onBlur={() => {
          setShowDropdown(false)
        }}
        iconInset
      />

      {showDropdown && (
        <Elements.Form.DropdownWrapper>
          {suggestedAddresses.map((address, index) => (
            <Elements.Form.DropdownButton
              key={index}
              name={address.name}
              onMouseDown={(event) => handleDropdownSelect(event, address)}
            >
              {address.displayName}
            </Elements.Form.DropdownButton>
          ))}
        </Elements.Form.DropdownWrapper>
      )}

      {showSaveFavorite && (
        <Elements.Buttons.NeutralButton onClick={saveAsFavorite}>
          Spara som favoritposition
        </Elements.Buttons.NeutralButton>
      )}
    </Elements.Layout.InputInnerContainer>
  )
}

export default Component
