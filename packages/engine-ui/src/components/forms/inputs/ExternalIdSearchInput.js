import React, { useState } from 'react'
import * as Elements from '../../../shared-elements'
import searchParcelIcon from '../../../assets/black-parcel.svg'
import checkIcon from '../../../assets/check-icon.svg'
import * as hooks from '../../../hooks'
import debounce from 'lodash.debounce'
import { useSocket } from 'use-socketio'
import { useField, useFormikContext } from 'formik'

const Component = ({ onSearchResult, placeholder, name, ...rest }) => {
  const [search] = hooks.useGetParcelInfo([])
  const [resultsIsFound, setResultsIsFound] = useState(false)
  const { setFieldValue } = useFormikContext()
  const [field] = useField(name)

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
    return setFieldValue(field.name, event.target.value)
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
        name="externalId"
        type="text"
        placeholder={placeholder}
        onChange={onSearchInputHandler}
        iconinset="true"
      />
    </Elements.Layout.InputInnerContainer>
  )
}

export default Component
