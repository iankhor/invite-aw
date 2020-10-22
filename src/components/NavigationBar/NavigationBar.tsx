import React from 'react'
import { Navbar } from 'react-bootstrap'
import Logo from './../../images/broccoli.svg'

export default function NavigationBar() {

  return (
    <>
      <Navbar fixed="top">
        <img className="mr-2" src={Logo} style={{ height: '1.5rem' }}/>
        <Navbar.Brand>
          Brocolli and Co.
        </Navbar.Brand>
      </Navbar>
    </>
  )
}
