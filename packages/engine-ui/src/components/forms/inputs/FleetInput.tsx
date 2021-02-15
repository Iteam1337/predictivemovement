import React from 'react'
import * as Elements from '../../../shared-elements'
import * as stores from '../../../utils/state/stores'
import styled from 'styled-components'
import arrowIcon from '../../../assets/input-arrowdown.svg'

const ShowDropdownIcon = styled.img`
  width: 10px;
  height: 10px;
`
const ShowDropdownButton = styled.button`
  position: absolute;
  left: 90%;
  height: 90%;
  top: 2px;
  border: none;
  background-color: #f1f3f5;
  :focus {
    outline: none;
  }
`

interface Props {
  onChangeHandler: any
  placeholder: string
  value: string
}

const Dropdown: React.FC<{
  items: string[]
  handleDropdownSelect: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    value: string
  ) => void
}> = ({ items, handleDropdownSelect }) => {
  return (
    <Elements.Form.DropdownWrapper>
      {items.map((value: string, index: number) => (
        <Elements.Form.DropdownButton
          key={index}
          name={value}
          onMouseDown={(event) => handleDropdownSelect(event, value)}
        >
          {value}
        </Elements.Form.DropdownButton>
      ))}
    </Elements.Form.DropdownWrapper>
  )
}

const Component: React.FC<Props> = ({
  onChangeHandler,
  placeholder,
  value,
  ...rest
}) => {
  const transports = stores.dataState((state) => state.transports)
  const [fleets, setFleets] = React.useState<string[]>([])
  const [showDropdown, setShowDropdown] = React.useState(false)
  const [showSearchDropdown, setShowSearchDropdown] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState<string[]>([])

  React.useEffect(() => {
    const getFleets = transports.flatMap(({ metadata }) => metadata.fleet)
    const fleetNames: string[] = getFleets
      .filter((value, index) => getFleets.indexOf(value) === index)
      .filter((name) => name !== '')
      .sort()
    setFleets(fleetNames)
  }, [transports])

  const handleDropdownSelect = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    name: string
  ) => {
    event.persist()
    setShowDropdown(false)

    return onChangeHandler({ name })
  }

  const onFleetInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist()
    const filterFleets = fleets.filter((fleet) =>
      fleet.toLowerCase().includes(event.target.value.toLowerCase())
    )

    setSearchValue(filterFleets)
    if (searchValue) setShowSearchDropdown(true)

    return onChangeHandler({ name: event.target.value })
  }

  return (
    <Elements.Layout.InputInnerContainer>
      {fleets.length > 0 && (
        <ShowDropdownButton
          onClick={(event) => {
            event.preventDefault()
            setShowDropdown((showDropdown) => !showDropdown)
          }}
        >
          <ShowDropdownIcon src={arrowIcon} />
        </ShowDropdownButton>
      )}
      <Elements.Form.TextInput
        {...rest}
        name="fleet"
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={onFleetInputHandler}
        onBlur={() => {
          setShowSearchDropdown(false)
          setShowDropdown(false)
        }}
      />

      {showSearchDropdown && (
        <Dropdown
          items={searchValue}
          handleDropdownSelect={handleDropdownSelect}
        />
      )}

      {showDropdown && (
        <Dropdown items={fleets} handleDropdownSelect={handleDropdownSelect} />
      )}
    </Elements.Layout.InputInnerContainer>
  )
}

export default Component
