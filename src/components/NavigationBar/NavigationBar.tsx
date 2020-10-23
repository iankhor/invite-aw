import React from 'react'
import { Navbar } from 'react-bootstrap'
import Logo from './../../images/broccoli.svg'

export default function NavigationBar() {

  return (
    <>
      <Navbar variant="dark" fixed="top" className="nav">
        <img className="logo mr-2" src={Logo}/>
        <Navbar.Brand>
          Brocolli and Co.
        </Navbar.Brand>
      </Navbar>
    </>
  )
}
