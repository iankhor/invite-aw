export type RequestPayload = {
  name: string | null
  email: string | null
}

export type InviteForm = {
  confirmEmail: string | null
} & RequestPayload & { errors: InviteFormErrors }

export type Error = 'blank' | 'different' | 'short' | 'invalid'

export type InviteFormErrors = {
  name: Error[] | null
  email: Error[] | null
  confirmEmail: Error[] | null
}

