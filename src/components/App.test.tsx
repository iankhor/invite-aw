import React from 'react'
import { render, screen, waitFor, within } from '@testing-library/react'
import user from '@testing-library/user-event'
import App from './App'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { RequestPayload } from '../types'

const URL = 'https://l94wc2001h.execute-api.ap-southeast-2.amazonaws.com/prod/fake-auth'

const server = setupServer()
beforeAll(() => server.listen())
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

describe('requesting an invite', () => {
  function populateRequestForm(formOverides: any = {}) {
    const form = {
      name: 'myname',
      email: 'email@email.com',
      confirmEmail: 'email@email.com',
      ...formOverides,
    }

    render(<App />)

    const inviteButton = screen.getByRole('button', { name: /request an invite/i })
    user.click(inviteButton)

    const inviteModal = within(screen.getByRole('dialog', { name: /request an invite/i }))

    const nameField = inviteModal.getByRole('textbox', { name: /name/i })
    const emailField = inviteModal.getByRole('textbox', { name: 'Email' })
    const confirmEmailField = inviteModal.getByRole('textbox', { name: 'Confirm email' })
    const sendButton = inviteModal.getByRole('button', { name: /send/i })

    user.type(nameField, form.name)
    user.type(emailField, form.email)
    user.type(confirmEmailField, form.confirmEmail)

    return { inviteModal, nameField, emailField, confirmEmailField, sendButton }
  }

  describe('sucessfully requesting an invite', () => {
    it('shows a confirmation message about the invite', async () => {
      setupMock()
      const { sendButton } = populateRequestForm()

      user.click(sendButton)

      await waitFor(() => {
        expect(screen.getByRole('dialog', { name: /all done/i })).toBeVisible()
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
      })
    })
  })
})
