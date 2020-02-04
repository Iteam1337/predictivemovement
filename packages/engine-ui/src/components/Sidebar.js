import React, { useEffect } from 'react'
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
    :hover {
      cursor: pointer;
    }
  }
`

const Sidebar = ({ data, x, y }) => {
  const [open, setOpen] = React.useState(false)

  useEffect(() => {
    if (!data.id) return
    setOpen(true)
  }, [data])

  return (
    <>
      <NavStrip>
        <img onClick={() => setOpen(current => !current)} src={Icon} alt="" />
      </NavStrip>

      <Container open={open}>
        {data && data.id && (
          <>
            <p>{data.id}</p>
            {/* <p>{data.geometry.coordinates[0]}</p>
            <p>{data.geometry.coordinates[1]}</p> */}
            {data.properties.diff && (
              <p>{`Duration diff: ${data.properties.diff.duration}`}</p>
            )}
            {data.properties.diff && (
              <p>{`Distance diff: ${data.properties.diff.distance}`}</p>
            )}
          </>
        )}
      </Container>
    </>
  )
}

export default Sidebar
