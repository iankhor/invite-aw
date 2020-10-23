export type RequestPayload = {
  name: string
  email: string
}

export type InviteForm = {
  confirmEmail: string
} & RequestPayload & { errors: InviteFormErrors }

export type Error = 'blank' | 'different' | 'short' | 'invalid'

type InviteFormErrors = {
  name: Error[]
  email: Error[]
  confirmEmail: Error[]
}

export type RequestInviteState = {
  form: InviteForm ,
  errors: string | ''
}