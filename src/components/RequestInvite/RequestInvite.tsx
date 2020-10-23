import React, { useState, ChangeEvent, useEffect, useReducer } from 'react'
import inviteFormReducer, { initialFormState } from './requestFormState'
import { Modal, Button} from 'react-bootstrap'
import { InviteForm as Form,  } from '../../types'
import useRequestInvite from './../../hooks/useRequestInvite'
import InviteForm from './components/InviteForm'

function Success({ handleClose }: any) {
  return (
    <div className="text-center">
      <p>You will be one of the first to experience Brocolli and Co. when we launch.</p>
      <Button variant="success" block onClick={handleClose}>OK</Button>
    </div>
  )
  
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
    name: [isBlank, isShort],
    email: [isBlank, isEmailValid],
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
  const [form, setForm] = useState<any>({})
  const [formErrors, setFormErrors] = useState({})

  const { request, loading, success, error: serverError, reset } = useRequestInvite()

  function resetForm() {
    setForm({})
    setFormErrors({})
    reset()
  }

  function fieldChange(key: keyof Form) {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void =>
      setForm({
        ...form,
        [key]: e.target.value,
      })
  }

  function validateForm(form: Form) {
    const { name, email, confirmEmail } = form

    const errors =  {
      name: buildError(name, validatorFor('name')),
      email: buildError(email, validatorFor('email')),
      confirmEmail: buildError(confirmEmail, validatorFor('confirmEmail', email, confirmEmail)),
    }

    setFormErrors(errors)

    return errors
  }

  function fieldBlur(field: keyof Form) {
    const args = field === 'confirmEmail' ? [form.email, form.confirmEmail] : []

    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
      setFormErrors({
        ...formErrors,
        [field]: buildError(e.target.value, validatorFor(field, ...args)),
      })
    }
  }

  function requestInvite() {
    const isFormValid = Object.values(validateForm(form)).every((e: any) => e.length === 0)

    if (isFormValid) {
      const { confirmEmail, ...payload } = form
      request(payload)
    }
  }

  useEffect(() => {
    if(show) resetForm()
    // eslint-disable-next-line
  }, [show])

  return (
    <>
      <Modal
        aria-labelledby={success ? 'success' : 'request-an-invite'}
        role="dialog"
        show={show}
        onHide={handleClose}
        centered
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title id={success ? 'success' : 'request-an-invite'} className="w-100 text-center">
            {success ? 'All done !' : 'Request an invite'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {success ? (
            <Success handleClose={handleClose}/>
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
