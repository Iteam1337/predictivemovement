import React, { useState } from 'react'
import * as Elements from '../../../shared-elements'
import searchParcelIcon from '../../../assets/black-parcel.svg'
import checkIcon from '../../../assets/check-icon.svg'
import * as hooks from '../../../utils/hooks'
import debounce from 'lodash.debounce'
import { useSocket } from 'use-socketio'

const Component = ({
  onChangeHandler,
  onSearchResult,
  placeholder,
  value,
  formError,
  ...rest
}) => {
  const [search, parcelInfo] = hooks.useGetParcelInfo([])
  const [resultsIsFound, setResultsIsFound] = useState(false)

  useSocket('parcel-info', ({ weight, measurements }) => {
    if (weight || measurements) {
      setResultsIsFound(true)
      onSearchResult({ weight, measurements })
    }
  })

  const searchWithDebounce = React.useMemo(
    () => debounce((q) => search(q), 300),
    [search]
  )

  const onSearchInputHandler = (event) => {
    event.persist()
    searchWithDebounce(event.currentTarget.value)
    return onChangeHandler(event)
  }
  return (
    <Elements.Layout.InputInnerContainer>
      {resultsIsFound ? (
        <Elements.Icons.FormInputIcon
          alt="Parcel Search Success Icon"
          src={`${checkIcon}`}
        />
      ) : (
        <Elements.Icons.FormInputIcon
          alt="Parcel Search Icon"
          src={`${searchParcelIcon}`}
        />
      )}
      <Elements.Form.TextInput
        {...rest}
        error={formError}
        name="externalId"
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={onSearchInputHandler}
        iconInset
      />
    </Elements.Layout.InputInnerContainer>
  )
}

export default Component
