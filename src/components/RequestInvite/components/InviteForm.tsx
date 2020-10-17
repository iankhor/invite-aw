import React from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

export default function InviteForm({
  form,
  fieldChange,
  fieldBlur,
  requestInvite,
  formErrors,
  serverError,
  loading,
}: any) {
  return (
    <Form>
      <Form.Group controlId="name">
        <Form.Label srOnly>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Full name"
          value={form.name || ''}
          onChange={fieldChange('name')}
          onBlur={fieldBlur('name')}
          aria-invalid={formErrors.name?.length > 0}
          isInvalid={formErrors.name?.length > 0}
        />
      </Form.Group>

      <Form.Group controlId="email">
        <Form.Label srOnly>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Email"
          value={form.email || ''}
          onChange={fieldChange('email')}
          onBlur={fieldBlur('email')}
          aria-invalid={formErrors.email?.length > 0}
          isInvalid={formErrors.email?.length > 0}
        />
      </Form.Group>

      <Form.Group controlId="confirm-email">
        <Form.Label srOnly>Confirm email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Confirm email"
          onChange={fieldChange('confirmEmail')}
          onBlur={fieldBlur('confirmEmail')}
          aria-invalid={formErrors.confirmEmail?.length > 0}
          isInvalid={formErrors.confirmEmail?.length > 0}
        />
      </Form.Group>

      <Button variant="primary" block onClick={requestInvite}>
        {loading ? 'Sending, please wait.' : 'Send'}
      </Button>

      <Form.Text className="text-muted">{serverError}</Form.Text>
    </Form>
  )
}
