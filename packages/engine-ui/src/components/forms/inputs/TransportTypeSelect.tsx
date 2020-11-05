import React from 'react'
import * as Elements from '../../../shared-elements'

type options = {
  name: string
  weight: number
  volume: number
}

const Component: React.FC<{ onChange: any; options: options[] }> = ({
  onChange,
  options,
}) => {
  return (
    <Elements.Form.SelectInput name="capacity" onChange={onChange}>
      {options.map(({ name, weight, volume }) => {
        if (name === 'custom') {
          return (
            <option key={name} value="custom">
              Ange anpassad kapacitet
            </option>
          )
        }

        return (
          <option key={name} value={name}>
            {name} (max {volume} m3, {weight} kg)
          </option>
        )
      })}
    </Elements.Form.SelectInput>
  )
}

export default Component
