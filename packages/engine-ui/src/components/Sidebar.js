import React from 'react'
import styled from 'styled-components'
import Icon from '../dashboard.svg'

const Container = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  height: 100vh;
  background: #fcf7fc;
  width: 250px;
  z-index: 1;
  transition: transform 200ms ease;
  transform: translateX(-100%);
  padding: 1rem;

  ${({ open }) => open && 'transform: translateX(50px);'}
`

const NavStrip = styled.div`
  padding-top: 1rem;
  position: absolute;
  left: 0;
  top: 0;
  height: 100vh;
  background: dodgerblue;
  width: 50px;
  z-index: 2;
  display: flex;
  justify-content: center;
  box-shadow: 1px 1px 10px 1px rgba(0, 0, 0, 0.5);

  img {
    width: 30px;
    height: 30px;
  }
`

const Sidebar = ({ data }) => {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="">
      <NavStrip>
        <img onClick={() => setOpen(current => !current)} src={Icon} alt="" />
      </NavStrip>

      <Container open={open}>
        {data && (
          <>
            <p>{data.carId}</p>
            <p>{data.coordinates[0]}</p>
            <p>{data.coordinates[1]}</p>
            <p>{`Duration diff: ${data.diff.duration}`}</p>
            <p>{`Distance diff: ${data.diff.distance}`}</p>
          </>
        )}
      </Container>
    </div>
  )
}

export default Sidebar
