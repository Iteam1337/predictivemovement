import phone from 'phone'

export const validatePhoneNumber = (value: string) => {
  let error
  if (value === '-') return
  const normalizedPhoneNumber = phone(value, 'SWE')
  if (normalizedPhoneNumber.length <= 0) {
    error = 'Fyll i ett korrekt telefonnummer'
  }
  if (value === '') {
    error = validateNotEmpty(value)
  }
  return error
}

export const validateAddress = (value: any) => {
  let error
  if (!value.lon || !value.lat) {
    error = 'Adressen kunde inte hittas'
  }

  if (value.name === '') {
    error = validateNotEmpty(value.name)
  }

  return error
}

export const validateNotEmpty = (value: string) => {
  let error
  if (value == '') {
    error = 'Dettta fält är obligatoriskt'
  }

  return error
}
