import React from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

function errorMessage(field: string, errorKey: string): string {
  const errors = {
    blank: `${field} is required`, 
    short: `${field} needs at least 3 characters`, 
    invalid: `${field} is invalid`,
    different: `${field} is different`,
    default: ''
  } as Record<string, string>

  return errors[errorKey] || errors.default
}

export default function InviteForm({
  form,
  fieldChange,
  fieldBlur,
  requestInvite,
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
          disabled={loading}
          value={form.name || ''}
          onChange={fieldChange('name')}
          onBlur={fieldBlur('name')}
          aria-invalid={form.errors.name?.length > 0}
          isInvalid={form.errors.name?.length > 0}
        />
        <Form.Control.Feedback type="invalid">{errorMessage('Full name', form.errors.name?.[0])}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="email">
        <Form.Label srOnly>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Email"
          disabled={loading}
          value={form.email || ''}
          onChange={fieldChange('email')}
          onBlur={fieldBlur('email')}
          aria-invalid={form.errors.email?.length > 0}
          isInvalid={form.errors.email?.length > 0}
        />
        <Form.Control.Feedback type="invalid">{errorMessage('Email', form.errors.email?.[0])}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="confirm-email">
        <Form.Label srOnly>Confirm email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Confirm email"
          disabled={loading}
          onChange={fieldChange('confirmEmail')}
          onBlur={fieldBlur('confirmEmail')}
          aria-invalid={form.errors.confirmEmail?.length > 0}
          isInvalid={form.errors.confirmEmail?.length > 0}
        />
        <Form.Control.Feedback type="invalid">{errorMessage('Email', form.errors.confirmEmail?.[0])}</Form.Control.Feedback>
      </Form.Group>

      <Button variant="success" block onClick={requestInvite} disabled={loading}>
        {loading ? 'Sending, please wait.' : 'Send'}
      </Button>

      <Form.Text className="text-muted">{serverError}</Form.Text>
    </Form>
  )
}
