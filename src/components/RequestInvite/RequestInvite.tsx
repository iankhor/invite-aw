import React, { ChangeEvent, useEffect, useReducer } from 'react'
import inviteFormReducer, { initialFormState, validateForm } from './requestFormState'
import { Modal, Button } from 'react-bootstrap'
import { InviteForm as Form } from '../../types'
import useRequestInvite from './../../hooks/useRequestInvite'
import InviteForm from './components/InviteForm'

function Success({ handleClose }: any) {
  return (
    <div className="text-center">
      <p>You will be one of the first to experience Brocolli and Co. when we launch.</p>
      <Button variant="success" block onClick={handleClose}>
        OK
      </Button>
    </div>
  )
}

export default function RequestInvite({ show, handleClose }: any) {
  const [state, dispatch] = useReducer(inviteFormReducer, initialFormState)
  const { request, loading, success, error: serverError, reset } = useRequestInvite()

  function resetForm() {
    reset()
    dispatch({ type: 'reset' })
  }

  function fieldChange(field: keyof Form) {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
      dispatch({ type: 'change', property: field, value: e.target.value })
    }
  }

  function fieldBlur(field: keyof Form) {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
      dispatch({ type: 'blur', property: field, value: e.target.value })
    }
  }

  function requestInvite() {
    dispatch({ type: 'submit' })
    const isFormValid = Object.values(validateForm(state.form)).every((e: any) => e.length === 0)

    if (isFormValid) {
      const { confirmEmail, ...payload } = state.form
      request(payload)
    }
  }

  useEffect(() => {
    if (show) resetForm()
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
            <Success handleClose={handleClose} />
          ) : (
            <InviteForm
              form={state.form}
              fieldChange={fieldChange}
              fieldBlur={fieldBlur}
              requestInvite={requestInvite}
              serverError={serverError}
              loading={loading}
            />
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}
