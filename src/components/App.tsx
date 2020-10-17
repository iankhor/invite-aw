import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'

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
      <Button onClick={handleOpen}>Request an invite</Button>

      <Modal aria-labelledby="request-an-invite" role="dialog" show={open} onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          <Modal.Title id="request-an-invite">Request an invite</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="name">
              <Form.Label srOnly>Name</Form.Label>
              <Form.Control type="text" placeholder="Full name" />
            </Form.Group>

            <Form.Group controlId="email">
              <Form.Label srOnly>Email</Form.Label>
              <Form.Control type="email" placeholder="Email" />
            </Form.Group>

            <Form.Group controlId="confirm-email">
              <Form.Label srOnly>Confirm email</Form.Label>
              <Form.Control type="email" placeholder="Confirm email" />
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}
