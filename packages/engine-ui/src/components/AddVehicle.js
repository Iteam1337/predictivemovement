import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import locationIcon from '../assets/location.svg'
import Elements from './Elements'

import Form from './forms/AddVehicle'
import 'react-datepicker/dist/react-datepicker.css'

const AddVehicle = ({ createVehicle }) => {
  const history = useHistory()

  const [formState, setState] = React.useState({
    name: '',
    id: '',
    cargo: '',
    startTime: '',
    endTime: '',
    endDestination: { name: '', lat: '', lon: '' },
    driver: { name: '', contact: '' },
  })

  const onSubmitHandler = (event) => {
    event.preventDefault()
    if (
      !formState.pickup.lat ||
      !formState.pickup.lon ||
      !formState.delivery.lat ||
      !formState.delivery.lon
    ) {
      return false
    }

    createVehicle({
      ...formState,
      pickup: formState.pickup,
      delivery: formState.delivery,
    })

    history.push('/')
  }

  return (
    <Elements.Container>
      <h3>Lägg till fordon</h3>
      <Form
        onChangeHandler={setState}
        onSubmitHandler={onSubmitHandler}
        state={formState}
      />
    </Elements.Container>
  )
}

// const AddVehicle = ({ addVehicle, currentPosition }) => {
//   const history = useHistory()
//   const [formState, setState] = React.useState('')
//   const [position, setPosition] = React.useState({})
//   const [isActive, setActive] = React.useState(false)

//   useEffect(() => {
//     if (position.lat && position.lon) {
//       setState(`${position.lat},${position.lon}`)
//     }
//   }, [position])

//   useEffect(() => {
//     if (isActive && currentPosition.lat && currentPosition.lon) {
//       setPosition(currentPosition)
//     }
//   }, [currentPosition, isActive])

//   useEffect(() => {
//     setActive(true)

//     return () => setActive(false)
//   }, [isActive])

//   const handleCreateOnEmptyFormState = () => {
//     console.log('creating vehicle in middle of ljusdal')
//     const basePosition = '61.8294925,16.0565493' // Middle of Ljusdal

//     const carPosition = basePosition
//       .split(',')
//       .map(parseFloat)
//       .filter((x) => !!x)

//     addVehicle({ lat: carPosition[0], lon: carPosition[1] })

//     history.push('/')
//   }

//   const onSubmitHandler = (event) => {
//     event.preventDefault()

//     if (!formState) {
//       return handleCreateOnEmptyFormState()
//     }

//     const carPosition = formState
//       .split(',')
//       .map(parseFloat)
//       .filter((x) => !!x)

//     if (!carPosition.length) return false
//     addVehicle({ lat: carPosition[0], lon: carPosition[1] })

//     history.push('/')
//   }

//   return (
//     <Elements.Container>
//       <h3>Lägg till fordon</h3>
//       <form onSubmit={onSubmitHandler} autoComplete="on">
//         <div>
//           <Elements.InputContainer>
//             <Elements.Label htmlFor="name">Namn på fordon</Elements.Label>
//             <Elements.InputInnerContainer>
//               <Elements.FormInputIcon
//                 alt="Position icon"
//                 src={`${locationIcon}`}
//               />
//               <Elements.TextInput
//                 name="name"
//                 type="text"
//                 value={formState}
//                 placeholder="Paketbil"
//                 onChange={(e) => setState(e.target.value)}
//               />
//             </Elements.InputInnerContainer>
//           </Elements.InputContainer>
//           <Elements.InputContainer>
//             <Elements.Label htmlFor="capacity">Kapacitet</Elements.Label>
//             <Elements.InputInnerContainer>
//               <Elements.FormInputIcon
//                 alt="Position icon"
//                 src={`${locationIcon}`}
//               />
//               <Elements.TextInput
//                 name="capacity"
//                 type="text"
//                 value={formState}
//                 placeholder="Lastvolym"
//                 onChange={(e) => setState(e.target.value)}
//               />
//             </Elements.InputInnerContainer>
//           </Elements.InputContainer>
//           <Elements.InputContainer>
//             <Elements.Label htmlFor="schedule">Körschema</Elements.Label>
//             <Elements.InputInnerContainer>
//               <Elements.FormInputIcon
//                 alt="Position icon"
//                 src={`${locationIcon}`}
//               />
//               <Elements.TextInput
//                 name="schedule"
//                 type="text"
//                 value={formState}
//                 placeholder="61.8294925,16.0565493"
//                 onChange={(e) => setState(e.target.value)}
//               />
//             </Elements.InputInnerContainer>
//           </Elements.InputContainer>
//           <Elements.InputContainer>
//             <Elements.Label htmlFor="position">Position</Elements.Label>
//             <Elements.InputInnerContainer>
//               <Elements.FormInputIcon
//                 alt="Position icon"
//                 src={`${locationIcon}`}
//               />
//               <Elements.TextInput
//                 name="position"
//                 type="text"
//                 value={formState}
//                 placeholder="61.8294925,16.0565493"
//                 onChange={(e) => setState(e.target.value)}
//               />
//             </Elements.InputInnerContainer>
//           </Elements.InputContainer>
//           {/* <Elements.InputContainer>
//             <Elements.Label htmlFor="position">Position</Elements.Label>
//             <Elements.InputInnerContainer>
//               <Elements.FormInputIcon
//                 alt="Position icon"
//                 src={`${locationIcon}`}
//               />
//               <Elements.TextInput
//                 name="position"
//                 type="text"
//                 value={formState}
//                 placeholder="61.8294925,16.0565493"
//                 onChange={(e) => setState(e.target.value)}
//               />
//             </Elements.InputInnerContainer>
//           </Elements.InputContainer> */}
//         </div>
//         <Elements.ButtonWrapper>
//           <Elements.CancelButton
//             type="button"
//             onClick={() => history.push('/')}
//           >
//             Avbryt
//           </Elements.CancelButton>
//           <Elements.SubmitButton type="submit">Lägg till</Elements.SubmitButton>
//         </Elements.ButtonWrapper>
//       </form>
//     </Elements.Container>
//   )
// }
export default AddVehicle
