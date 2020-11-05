import React from 'react'
import * as Elements from '../../../shared-elements'

type options = {
  label: string
  value: string
  weight: number
  volume: number
}

type parcelSizeOptions = {
  label: string
  value: string
  weight: number
  measurements: string
}

const TransportCapacity: React.FC<{ onChange: any; options: options[] }> = ({
  onChange,
  options,
}) => {
  return (
    <Elements.Form.SelectInput name="capacity" onChange={onChange}>
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

const ParcelSize: React.FC<{ onChange: any; options: parcelSizeOptions[] }> = ({
  onChange,
  options,
}) => {
  return (
    <Elements.Form.SelectInput name="capacity" onChange={onChange}>
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
}

export { TransportCapacity, ParcelSize }
