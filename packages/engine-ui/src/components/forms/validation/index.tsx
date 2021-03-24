import phone from 'phone'

export const validatePhoneNumber = (value: string) => {
  let error
  if (value == '-') return
  const normalizedPhoneNumber = phone(value, 'SWE')
  if (normalizedPhoneNumber.length <= 0) {
    error = 'Fyll i ett korrekt telefonnummer'
  }
  return error
}

export const validateAddress = (value: string) => {
  let error
  console.log(value)
  // if (!value.lat && !value.lon) {
  //   console.log('jag borde vara här nu')
  //   error = 'Adressen kunde inte hittas'
  // }

  return error
}
