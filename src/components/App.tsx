import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import RequestInvite from './RequestInvite/RequestInvite'

export default function App() {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>Request an invite</Button>

      <RequestInvite show={open} handleClose={() => setOpen(false)} />
    </>
  )
}
