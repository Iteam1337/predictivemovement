import fetch from 'node-fetch'

export const getAddressFromCoordinate = async ({
  lon,
  lat,
}: {
  lat: string
  lon: string
}): Promise<string> =>
  fetch(
    `https://pelias.iteamdev.io/v1/reverse?point.lat=${lat}&point.lon=${lon}`
  )
    .then((res) => res.json())
    .then(
      ({ features }: { features: { properties: { label: string } }[] }) =>
        features[0].properties.label
    )
