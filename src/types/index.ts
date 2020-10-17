export type RequestPayload = {
  name?: string
  email?: string
}

export type InviteForm = {
  confirmEmail?: string
} & RequestPayload
