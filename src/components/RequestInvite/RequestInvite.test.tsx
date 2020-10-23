import React from 'react'
import { render, screen, waitFor, waitForElementToBeRemoved, within } from '@testing-library/react'
import user from '@testing-library/user-event'
import RequestInvite from './RequestInvite'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { RequestPayload } from '../../types'
import { URL } from './../../hooks/useRequestInvite'
import axios from 'axios'

const requestSpy = jest.spyOn(axios, 'post')

const server = setupServer()
beforeAll(() => server.listen())
beforeEach(() => jest.clearAllMocks())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function setupMock() {
  server.use(
    rest.post(URL, (req, res, ctx) => {
      const payload = req.body as RequestPayload
      const isValid = payload.email !== 'usedemail@airwallex.com'

      return isValid
        ? res(ctx.status(200))
        : res(
            ctx.status(400),
            ctx.json({
              errorMessage: 'An invite has sent to this email before. Please use another email',
            })
          )
    })
  )
}

beforeEach(() => { jest.clearAllMocks() })

describe('requesting an invite', () => {
  function populateRequestForm(formOverides: any = {}) {
    const form = {
      name: 'myname',
      email: 'email@email.com',
      confirmEmail: 'email@email.com',
      ...formOverides,
    }

    const handleCloseSpy = jest.fn()

    render(<RequestInvite show={true} handleClose={handleCloseSpy}/>)

    const inviteModal = within(screen.getByRole('dialog', { name: /request an invite/i }))

    const nameField = inviteModal.getByRole('textbox', { name: /name/i })
    const emailField = inviteModal.getByRole('textbox', { name: 'Email' })
    const confirmEmailField = inviteModal.getByRole('textbox', { name: 'Confirm email' })
    const sendButton = inviteModal.getByRole('button', { name: /send/i })

    user.type(nameField, form.name)
    user.type(emailField, form.email)
    user.type(confirmEmailField, form.confirmEmail)

    return { inviteModal, nameField, emailField, confirmEmailField, sendButton, handleCloseSpy }
  }

  describe('while requesting an invite', () => {
    it('shows a message while an invite is being requested', async () => {
      setupMock()
      const { inviteModal, sendButton } = populateRequestForm()
      user.click(sendButton)

      const loadingButton = inviteModal.getByRole('button', { name: /sending, please wait/i })

      await waitFor(() => {
        expect(requestSpy).toHaveBeenCalledTimes(1)
        expect(loadingButton).toBeInTheDocument()
      })

      await waitForElementToBeRemoved(loadingButton)
    })
  })

  describe('sucessfully requesting an invite', () => {
    it('shows a confirmation message about the invite', async () => {
      setupMock()
      const { sendButton } = populateRequestForm()

      user.click(sendButton)

      await waitFor(() => {
        expect(screen.getByRole('dialog', { name: /all done/i })).toBeVisible()
        expect(requestSpy).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('failure when requesting an invite', () => {
    it('shows an error message', async () => {
      setupMock()
      const { inviteModal, sendButton } = populateRequestForm({
        email: 'usedemail@airwallex.com',
        confirmEmail: 'usedemail@airwallex.com',
      })

      user.click(sendButton)

      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: /all done/i })).not.toBeInTheDocument()
        expect(inviteModal.getByText('An invite has sent to this email before. Please use another email'))
        expect(requestSpy).toHaveBeenCalledTimes(1)
      })
    })

    describe('retrying after a failure', () => {
      it('is successful in requesting an invite', async () => {
        setupMock()
        const { inviteModal, sendButton, emailField, confirmEmailField } = populateRequestForm({
          email: 'usedemail@airwallex.com',
          confirmEmail: 'usedemail@airwallex.com',
        })

        user.click(sendButton)

        await waitFor(() => {
          expect(inviteModal.getByText('An invite has sent to this email before. Please use another email'))
        })

        user.type(emailField, '{backspace}{backspace}{backspace}{backspace}.com.au')
        user.type(confirmEmailField, '{backspace}{backspace}{backspace}{backspace}.com.au')
        user.click(sendButton)

        await waitFor(() => {
          expect(screen.getByRole('dialog', { name: /all done/i })).toBeVisible()
        })
      })
    })
  })

  describe('field errors', () => {
    function subject(fieldName: any, value: any) {
      render(<RequestInvite show={true} />)

      const inviteModal = within(screen.getByRole('dialog', { name: /request an invite/i }))

      const field = inviteModal.getByRole('textbox', { name: fieldName })
      user.type(field, value)

      return { inviteModal }
    }

    describe('name', () => {
      describe('when its less or equal to 3 characters', () => {
        it('shows inline error', () => {
          const { inviteModal } = subject('Name', '12')
          user.tab()

          expect(inviteModal.getByRole('textbox', { name: /name/i })).toBeInvalid()
        })
      })
    })

    describe('email', () => {
      describe('not entered', () => {
        it('shows inline error', () => {
          const { inviteModal } = subject('Email', '12')
          user.tab()


          expect(inviteModal.getByRole('textbox', { name: 'Email' })).toBeInvalid()
        })
      })
    })

    describe('when email and confirm email are not the same', () => {
      it('shows inline error', () => {
        const { inviteModal } = subject('Confirm email', '12')
        user.tab()

        expect(inviteModal.getByRole('textbox', { name: 'Confirm email' })).toBeInvalid()
      })
    })
    
    describe('submitting an empty request invite form', () => {
      it('does not make a request invite', () => {
        render(<RequestInvite show={true} />)
        const sendButton = screen.getByRole('button', { name: /send/i })
        user.click(sendButton)

        expect(requestSpy).toHaveBeenCalledTimes(0)
      })
    })
  })
})
