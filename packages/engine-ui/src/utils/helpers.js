const findAddress = async (query) => {
  const res = await fetch(
    `https://pelias.iteamdev.io/v1/autocomplete?text=${query}`
  )
  const data = await res.json()
  return data
}

export default {findAddress}