import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import user from '@testing-library/user-event'
import App from './App'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

const URL = 'https://l94wc2001h.execute-api.ap-southeast-2.amazonaws.com/prod/fake-auth'

const server = setupServer()
beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

function setupMock() {
  server.use(
    rest.post(URL, (req, res, ctx) => {
      const keys = Object.keys(req.body || {})
      const validForm = keys.includes('name') && keys.includes('email')

      return validForm ? res(ctx.status(200)) : res(ctx.status(422))
    })
  )
}

describe('requesting an invite', () => {
  it('has a request for invite button', () => {
    render(<App />)

    const inviteButton = screen.getByRole('button', { name: /request an invite/i })
    expect(inviteButton).toBeInTheDocument()
  })

  fit('shows a modal with a form when click on request for invite button', () => {
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
    fit('shows a confirmation message about the invite', async () => {
      setupMock()
      render(<App />)

      const inviteButton = screen.getByRole('button', { name: /request an invite/i })
      user.click(inviteButton)

      const nameField = screen.getByRole('textbox', { name: /name/i })
      const emailField = screen.getByRole('textbox', { name: 'Email' })
      const confirmEmailField = screen.getByRole('textbox', { name: 'Confirm email' })
      const sendButton = screen.getByRole('button', { name: /send/i })

      user.type(nameField, 'my name')
      user.type(emailField, 'email@email.com')
      user.type(confirmEmailField, 'email@email.com')
      user.click(sendButton)

      await waitFor(() => {
        expect(screen.getByRole('dialog', { name: /all done/i })).toBeVisible()
      })
    })
  })
})
