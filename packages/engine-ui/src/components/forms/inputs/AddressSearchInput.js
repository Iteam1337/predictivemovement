import React from 'react'
import * as Elements from '../../../shared-elements'
import locationIcon from '../../../assets/location.svg'
import * as hooks from '../../../hooks'
import debounce from 'lodash.debounce'
import { useField, useFormikContext } from 'formik'
import { validateAddress } from '../validation'

const Component = ({ onFocusHandler, placeholder, name = '', ...rest }) => {
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
  const { setFieldValue, handleBlur } = useFormikContext()
  const [field] = useField(name)

  const [selectedAddress, setSelectedAddress] = React.useState({})

  const searchWithDebounce = React.useMemo(
    () => debounce((q) => search(q, () => setShowDropdown(true)), 300),
    [search]
  )

  const onSearchInputHandler = (event) => {
    event.persist()
    setShowSaveFavorite(false)
    searchWithDebounce(event.target.value)

    return setFieldValue(field.name, { name: event.target.value })
  }

  const handleDropdownSelect = (event, address) => {
    event.persist()
    setShowDropdown(false)
    setShowSaveFavorite(!isFavorite(address.name, address.county))
    const selected = {
      street: address.name,
      city: address.county,
      name: `${address.name}, ${address.county}`,
      street: address.name,
      lon: address.lon,
      lat: address.lat,
    }
    setSelectedAddress(address)
    return setFieldValue(field.name, selected)
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
      <Elements.Icons.FormInputIcon
        alt="Location pickup icon"
        src={`${locationIcon}`}
      />

      <Elements.Form.TextInput
        {...rest}
        name={name}
        type="text"
        value={field.value.name}
        placeholder={placeholder}
        onChange={onSearchInputHandler}
        validate={(val) => validateAddress(val)}
        onFocus={() => {
          setShowDropdown(getFavoriteAddresses().length > 0)
          return onFocusHandler()
        }}
        onBlur={(e) => {
          handleBlur(e)
          setShowDropdown(false)
        }}
        iconinset="true"
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
