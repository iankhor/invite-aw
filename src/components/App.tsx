import React, { useState, ChangeEvent } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { RequestPayload } from '../types'
import useRequestInvite from './../hooks/useRequestInvite'

function InviteForm({ form, fieldChange, requestInvite, error, loading }: any) {
  return (
    <Form>
      <Form.Group controlId="name">
        <Form.Label srOnly>Name</Form.Label>
        <Form.Control type="text" placeholder="Full name" value={form.name || ''} onChange={fieldChange('name')} />
      </Form.Group>

      <Form.Group controlId="email">
        <Form.Label srOnly>Email</Form.Label>
        <Form.Control type="email" placeholder="Email" value={form.email || ''} onChange={fieldChange('email')} />
      </Form.Group>

      <Form.Group controlId="confirm-email">
        <Form.Label srOnly>Confirm email</Form.Label>
        <Form.Control type="email" placeholder="Confirm email" />
      </Form.Group>

      <Button variant="primary" block onClick={requestInvite}>
        {loading ? 'Sending, please wait.' : 'Send'}
      </Button>

      <Form.Text className="text-muted">{error}</Form.Text>
    </Form>
  )
}

function Success() {
  return <div>All done !!!</div>
}

export default function App() {
  const [open, setOpen] = useState<boolean>(false)
  const [form, setForm] = useState<RequestPayload>({})
  const { request, loading, success, error } = useRequestInvite()

  function fieldChange(key: keyof RequestPayload) {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void =>
      setForm({
        ...form,
        [key]: e.target.value,
      })
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  function requestInvite() {
    request(form)
  }

  return (
    <>
      <Button onClick={handleOpen}>Request an invite</Button>

      <Modal
        aria-labelledby={success ? 'success' : 'request-an-invite'}
        role="dialog"
        show={open}
        onHide={handleClose}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title id={success ? 'success' : 'request-an-invite'}>
            {success ? 'All done' : 'Request an invite'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {success ? (
            <Success />
          ) : (
            <InviteForm
              form={form}
              fieldChange={fieldChange}
              requestInvite={requestInvite}
              error={error}
              loading={loading}
            />
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}
