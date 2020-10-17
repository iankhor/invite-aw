import React, { useState } from 'react'
import AppBar from './AppBar'
import Button from '@material-ui/core/Button'

import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'

export default function App() {
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <AppBar />
      <Button color="secondary" variant="contained" onClick={handleOpen}>
        Request an invite
      </Button>

      <Dialog onClose={handleClose} aria-labelledby="request-an-invite" open={open}>
        <DialogTitle id="request-an-invite">Request an invite</DialogTitle>
      </Dialog>
    </>
  )
}
