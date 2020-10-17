import React, { useState, ChangeEvent } from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import axios from 'axios'

const URL = 'https://l94wc2001h.execute-api.ap-southeast-2.amazonaws.com/prod/fake-auth'

type RequestPayload = {
  name?: string
  email?: string
}

function useRequestInvite() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function request(payload: RequestPayload) {
    try {
      await axios.post(URL, payload)

      setSuccess(true)
    } catch {
      setSuccess(false)
    }
  }

  return {
    request,
    loading,
    success,
  }
}

function InviteForm({ form, fieldChange, requestInvite }: any) {
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
        Send
      </Button>
    </Form>
  )
}

function Success() {
  return <div>All done !!!</div>
}

export default function App() {
  const [open, setOpen] = useState<boolean>(false)
  const [form, setForm] = useState<RequestPayload>({})
  const { request, loading, success } = useRequestInvite()

  function fieldChange(key: keyof RequestPayload) {
    return (e: any) =>
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
          {success ? <Success /> : <InviteForm form={form} fieldChange={fieldChange} requestInvite={requestInvite} />}
        </Modal.Body>
      </Modal>
    </>
  )
}
