import React from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

export default function InviteForm({ form, fieldChange, requestInvite, error, loading }: any) {
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
