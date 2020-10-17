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
  it('has a request for invite button', () => {
    render(<App />)

    const inviteButton = screen.getByRole('button', { name: /request an invite/i })
    expect(inviteButton).toBeInTheDocument()
  })

  it('shows a modal with a form when click on request for invite button', () => {
    render(<App />)

    expect(screen.queryByRole('dialog', { name: /request an invite/i })).not.toBeInTheDocument()

    const inviteButton = screen.getByRole('button', { name: /request an invite/i })
    user.click(inviteButton)

    expect(screen.getByRole('dialog', { name: /request an invite/i })).toBeVisible()

    const nameField = screen.getByRole('textbox', { name: /name/i })
    const emailField = screen.getByRole('textbox', { name: 'Email' })
    const confirmEmailField = screen.getByRole('textbox', { name: 'Confirm email' })

    user.type(nameField, 'my name')
    user.type(emailField, 'email@email.com')
    user.type(confirmEmailField, 'email@email.com')

    expect(nameField).toHaveValue('my name')
    expect(emailField).toHaveValue('email@email.com')
    expect(confirmEmailField).toHaveValue('email@email.com')
  })

  describe('sucessfully requesting an invite', () => {
    it('shows a confirmation message about the invite', async () => {
      setupMock()
      render(<App />)

      const inviteButton = screen.getByRole('button', { name: /request an invite/i })
      user.click(inviteButton)

      const inviteModal = within(screen.getByRole('dialog', { name: /request an invite/i }))

      const nameField = inviteModal.getByRole('textbox', { name: /name/i })
      const emailField = inviteModal.getByRole('textbox', { name: 'Email' })
      const confirmEmailField = inviteModal.getByRole('textbox', { name: 'Confirm email' })
      const sendButton = inviteModal.getByRole('button', { name: /send/i })

      user.type(nameField, 'my name')
      user.type(emailField, 'email@email.com')
      user.type(confirmEmailField, 'email@email.com')
      user.click(sendButton)

      await waitFor(() => {
        expect(screen.getByRole('dialog', { name: /all done/i })).toBeVisible()
      })
    })
  })

  describe('failure when requesting an invite', () => {
    it('shows a confirmation message about the invite', async () => {
      setupMock()
      render(<App />)

      const inviteButton = screen.getByRole('button', { name: /request an invite/i })
      user.click(inviteButton)
      const inviteModal = within(screen.getByRole('dialog', { name: /request an invite/i }))

      const nameField = inviteModal.getByRole('textbox', { name: /name/i })
      const emailField = inviteModal.getByRole('textbox', { name: 'Email' })
      const confirmEmailField = inviteModal.getByRole('textbox', { name: 'Confirm email' })
      const sendButton = inviteModal.getByRole('button', { name: /send/i })

      user.type(nameField, 'my name')
      user.type(emailField, 'usedemail@airwallex.com')
      user.type(confirmEmailField, 'usedemail@airwallex.com')
      user.click(sendButton)

      await waitFor(() => {
        expect(screen.queryByRole('dialog', { name: /all done/i })).not.toBeInTheDocument()
        expect(inviteModal.getByText('An invite has sent to this email before. Please use another email'))
      })
    })
  })
})
