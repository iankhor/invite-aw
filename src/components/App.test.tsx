import React from 'react'
import { render, screen } from '@testing-library/react'
import user from '@testing-library/user-event'
import App from './App'

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
})
