import React from 'react'
import * as Elements from '../../../shared-elements'
import locationIcon from '../../../assets/location.svg'
import * as hooks from '../../../utils/hooks'
import debounce from 'lodash.debounce'

const Component = ({
  onChangeHandler,
  placeholder,
  value,
  formError,
  ...rest
}) => {
  const [search, _parcelInfo] = hooks.useGetParcelInfo([])

  const searchWithDebounce = React.useMemo(
    () => debounce((q) => search(q), 300),
    [search]
  )

  const onSearchInputHandler = (event) => {
    event.persist()
    searchWithDebounce(event.target.value)

    return onChangeHandler(event.target.value)
  }
  const resultsFound = false
  return (
    <Elements.Layout.InputInnerContainer>
      {resultsFound ? (
        <Elements.Icons.FormInputIcon
          alt="Warning icon"
          src={`${locationIcon}`}
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
