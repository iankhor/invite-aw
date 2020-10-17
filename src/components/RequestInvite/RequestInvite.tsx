import React, { useState, ChangeEvent } from 'react'
import Modal from 'react-bootstrap/Modal'
import { RequestPayload } from '../../types'
import useRequestInvite from './../../hooks/useRequestInvite'
import InviteForm from './components/InviteForm'

function Success() {
  return <div>All done !!!</div>
}

export default function RequestInvite({ open, handleClose }: any) {
  const [form, setForm] = useState<RequestPayload>({})
  const { request, loading, success, error } = useRequestInvite()

  function fieldChange(key: keyof RequestPayload) {
    return (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void =>
      setForm({
        ...form,
        [key]: e.target.value,
      })
  }

  function requestInvite() {
    request(form)
  }

  return (
    <>
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
