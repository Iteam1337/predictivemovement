import React from 'react'
import styled from 'styled-components'
import MainRouteLayout from '../layout/MainRouteLayout'
import { Transport } from '../../types'
import { useHistory, useParams } from 'react-router-dom'
import EditTransport from './EditTransport'
import Success from '../SuccessScreen'
import { getAddressFromCoordinate } from '../../utils/helpers'
import moment from 'moment'

interface Props {
  transports: Transport[]
  updateTransport: (params: any) => void
}

const LoadingWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const EditTransportRoute = ({ transports, updateTransport }: Props) => {
  const { transportId } = useParams<{ transportId: string }>()
  const history = useHistory()
  const transport = transports.find((t) => t.id === transportId)
  const [isFinished, setIsFinished] = React.useState(false)
  const handleOnClose = () => history.push('/transports')
  const [loading, setLoading] = React.useState(true)
  const [address, setAddress] = React.useState({
    startAddress: {},
    endAddress: {},
  })

  React.useEffect(() => {
    const setAddressFromCoordinates = async (
      startCoordinates: Transport['startAddress'],
      endCoordinates: Transport['endAddress']
    ) => {
      const startAddress = await getAddressFromCoordinate(startCoordinates)
      const endAddress = await getAddressFromCoordinate(endCoordinates)

      setAddress({
        startAddress: {
          name: `${startAddress.name}, ${startAddress.county}`,
          street: startAddress.name,
          city: startAddress.county,
        },
        endAddress: {
          name: `${endAddress.name}, ${endAddress.county}`,
          street: endAddress.name,
          city: endAddress.county,
        },
      })

      setLoading(false)
    }

    if (!transport) return
    setAddressFromCoordinates(transport.startAddress, transport.endAddress)
  }, [transport])

  if (isFinished)
    return (
      <Success onClose={handleOnClose} infoText="Transporten är uppdaterad!" />
    )

  return (
    <MainRouteLayout redirect="/transports">
      {!transport ? (
        <p>
          Kunde inte hitta transport med id: <b>{transportId}</b>
        </p>
      ) : loading ? (
        <LoadingWrapper>
          <p>Laddar...</p>
        </LoadingWrapper>
      ) : (
        <EditTransport
          transport={{
            ...transport,
            earliestStart:
              transport.earliestStart &&
              moment(transport.earliestStart, 'HH:mm').toDate(),
            latestEnd:
              transport.latestEnd &&
              moment(transport.latestEnd, 'HH:mm').toDate(),
            capacity: {
              weight: transport.capacity?.weight?.toString() || '',
              volume: transport.capacity?.volume.toString() || '',
            },
            startAddress: {
              ...transport.startAddress,
              ...address.startAddress,
            },
            endAddress: {
              ...transport.endAddress,
              ...address.endAddress,
            },
            metadata: {
              ...transport.metadata,
              driver: {
                ...(transport.metadata?.driver || {}),
                contact: transport.metadata?.driver?.contact?.startsWith('46')
                  ? '+' + transport.metadata?.driver?.contact
                  : transport.metadata?.driver?.contact,
              },
            },
          }}
          updateTransport={updateTransport}
          setIsFinished={setIsFinished}
        />
      )}
    </MainRouteLayout>
  )
}

export default EditTransportRoute
