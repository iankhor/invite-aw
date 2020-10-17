import React from 'react'
import { render } from '@testing-library/react'
import { screen } from '@testing-library/dom'
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

    const inviteButton = screen.getByRole('button', { name: /request an invite/i })
    user.click(inviteButton)

    const inviteModal = screen.getByRole('dialog', { name: /request an invite/i })
    expect(inviteModal).toBeVisible()
  })
})
