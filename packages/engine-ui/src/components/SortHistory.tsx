import React from 'react'
import { Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'
import * as Elements from '../shared-elements'
import arrowIcon from '../assets/input-arrowdown.svg'

const FleetInput = styled.div`
  background-color: #f1f3f5;
  border-radius: 0.25rem;
  width: 150px;
  font-size: 0.875rem;
  :focus {
    outline-color: #13c57b;
  }
  @media (max-width: 768px) {
    width: 80vw;
  }
`

const FleetText = styled.p`
  padding: 0.55rem;
  margin: 0;
  display: flex;
  justify-content: space-between;
`

const Icon = styled.img`
  width: 10px;
  height: 10px;
  margin-top: 5px;
`

const Wrapper = styled.div`
  width: 8rem;
  margin-right: 3rem;
`

const SortWrapper = styled.form`
  display: flex;
  width: 100%;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    margin-bottom: 2rem;
    width: 100%;
    flex-direction: column;
  }
`
const DropdownButton = styled.button`
  width: inherit;
  text-align: left;
  padding: 0.5rem;
  border: 1px solid grey;
  :focus {
    outline-color: #13c57b;
  }
  background-color: #f1f3f5;
`

const Label = styled.label`
  font-size: 14px;
`

const DropDown: React.FC<{
  items: string[]
  handleDropdownSelect: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    value: string
  ) => void
}> = ({ items, handleDropdownSelect }) => {
  return (
    <>
      {items.map((item, i) => {
        return (
          <DropdownButton
            key={i}
            onMouseDown={(event) => handleDropdownSelect(event, item)}
          >
            {item}
          </DropdownButton>
        )
      })}
    </>
  )
}

const SortHistory: React.FC<{
  setFromDate: Dispatch<SetStateAction<string>>
  setToDate: Dispatch<SetStateAction<string>>
  setSelectedFleet: Dispatch<SetStateAction<string>>
  selectedFleet: string
  uniqueFleets: string[]
  fromDate: string
  toDate: string
}> = ({
  setFromDate,
  setToDate,
  setSelectedFleet,
  selectedFleet,
  uniqueFleets,
  fromDate,
  toDate,
}) => {
  const dropdownFleets = React.useRef<HTMLDivElement>(null)
  const [showDropdown, setShowDropdown] = React.useState(false)

  const updateFromDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFromDate(e.currentTarget.value)
  }

  const updateToDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToDate(e.currentTarget.value)
  }

  const handleDropdownSelect = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    item: string
  ) => {
    event.persist()
    setShowDropdown(false)
    setSelectedFleet(item)
  }

  React.useEffect(() => {
    document.addEventListener('click', handleDocumentClick)
    return () => document.removeEventListener('click', handleDocumentClick)
  }, [])

  const handleDocumentClick = (e: any) => {
    if (e.target && !dropdownFleets.current?.contains(e.target as Node)) {
      setShowDropdown(false)
    }
  }

  return (
    <SortWrapper>
      <Wrapper>
        <Label htmlFor="fleet">Flotta </Label>
        <FleetInput
          onClick={() => setShowDropdown((current) => !current)}
          ref={dropdownFleets}
        >
          <FleetText>
            {selectedFleet} <Icon src={arrowIcon} />
          </FleetText>

          {showDropdown && (
            <DropDown
              items={['Alla', ...uniqueFleets]}
              handleDropdownSelect={handleDropdownSelect}
            />
          )}
        </FleetInput>
      </Wrapper>

      <Wrapper>
        <Label htmlFor="startDate">Fr.o.m. datum</Label>
        <FleetInput>
          <Elements.Form.TextInput
            id="startDate"
            type="date"
            value={fromDate}
            onChange={updateFromDate}
          />
        </FleetInput>
      </Wrapper>

      <Wrapper>
        <Label htmlFor="endDate">T.o.m. datum</Label>
        <FleetInput>
          <Elements.Form.TextInput
            id="endDate"
            type="date"
            value={toDate}
            onChange={updateToDate}
          />
        </FleetInput>
      </Wrapper>
    </SortWrapper>
  )
}

export default SortHistory
