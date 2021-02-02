import React from 'react'
import * as Elements from '../../../shared-elements'

type options = {
  label: string | undefined
  value: string
  weight: string | undefined
  volume: string | undefined
}

type parcelSizeOptions = {
  label: string
  value: string
  weight: string
  measurements: string
}

const TransportCapacity: React.FC<{
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  options: options[]
  defaultValue?: string
}> = ({ onChange, options, defaultValue }) => {
  return (
    <Elements.Form.SelectInput
      name="capacity"
      onChange={onChange}
      defaultValue={defaultValue}
    >
      {options.map(({ label, value, weight, volume }) => {
        if (value === 'custom') {
          return (
            <option key={value} value="custom">
              Ange anpassad kapacitet
            </option>
          )
        }

        return (
          <option key={value} value={value}>
            {label} (max {volume} m3, {weight} kg)
          </option>
        )
      })}
    </Elements.Form.SelectInput>
  )
}

const ParcelSize: React.FC<{
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  options: parcelSizeOptions[]
  defaultValue?: string
}> = ({ onChange, options, defaultValue }) => (
  <Elements.Form.SelectInput
    name="size"
    onChange={onChange}
    defaultValue={defaultValue}
  >
    {options.map(({ label, value, weight, measurements }) => {
      if (value === 'custom') {
        return (
          <option key={value} value="custom">
            Ange anpassad kapacitet
          </option>
        )
      }

      return (
        <option key={value} value={value}>
          {label} ({measurements} cm, {weight} kg)
        </option>
      )
    })}
  </Elements.Form.SelectInput>
)

export { TransportCapacity, ParcelSize }
