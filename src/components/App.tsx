import React, { useState } from 'react'
import RequestInvite from './RequestInvite'
import NavigationBar from './NavigationBar'
import Footer from './Footer'
import Main from './Main'

export default function App() {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <>
      <NavigationBar />
      <Main requestInvite={() => setOpen(true)}/>
      <RequestInvite show={open} handleClose={() => {setOpen(false)}} />
      <Footer />
    </>
  )
}
