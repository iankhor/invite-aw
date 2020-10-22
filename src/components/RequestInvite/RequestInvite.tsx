import React, { useState, ChangeEvent } from 'react'
import Modal from 'react-bootstrap/Modal'
import { InviteForm as Form } from '../../types'
import useRequestInvite from './../../hooks/useRequestInvite'
import InviteForm from './components/InviteForm'

function Success() {
  return <div>All done !!!</div>
}

function isBlank(str?: string) {
  return !str || (typeof str === 'string' && !str.match(/\S/gm)) ? 'blank' : null
}

function isSameValue(valueOne?: string | null, valueTwo?: string | null) {
  return valueOne && valueTwo && valueOne === valueTwo ? null : 'different'
}

function isEmailValid(email?: string) {
  return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? null : 'invalid'
}

function isShort(str?: string) {
  return str && str.length >= 3 ? null : 'short'
}

function validatorFor(property: string, value: string | null = null, comparedValue: string | null = null) {
  const validators = {
    name: [isShort],
    email: [isEmailValid],
    confirmEmail: [() => isSameValue(value, comparedValue)],
    default: [],
  } as Record<string, any>

  return validators[property] || validators.default
}

function buildError(value: any, validators: any) {
  return validators
    .map((validator: any) => {
      const errorKey = validator(value)
      const hasError = errorKey !== null

      return hasError ? errorKey : ''
    })
    .filter(Boolean)
}

export default function RequestInvite({ show, handleClose }: any) {
  const [form, setForm] = useState<Form>({})
  const [formErrors, setFormErrors] = useState({})

  const { request, loading, success, error: serverError } = useRequestInvite()

  function fieldChange(key: keyof Form) {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void =>
      setForm({
        ...form,
        [key]: e.target.value,
      })
  }

  function fieldBlur(field: keyof Form) {
    const args = field === 'confirmEmail' ? [form.email, form.confirmEmail] : []

    return (): void =>
      setFormErrors({
        ...formErrors,
        [field]: buildError(form[field], validatorFor(field, ...args)),
      })
  }

  function requestInvite() {
    const { confirmEmail, ...payload } = form
    request(payload)

    // TODO: specs for If the user clicks Send and one or more fields do not validate properly, the app should not contact the backend
    // const hasInteractedForm = Object.keys(formErrors || {}).length > 0
    // const isFormValid = Object.values(formErrors).every((e: any) => e.length === 0)

    // if (hasInteractedForm && isFormValid) {
    // const { confirmEmail, ...payload } = form
    //   request(payload)
    // }
  }

  return (
    <>
      <Modal
        aria-labelledby={success ? 'success' : 'request-an-invite'}
        role="dialog"
        show={show}
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
              fieldBlur={fieldBlur}
              requestInvite={requestInvite}
              serverError={serverError}
              formErrors={formErrors}
              loading={loading}
            />
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}
