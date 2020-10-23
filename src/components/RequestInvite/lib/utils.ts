
import { InviteForm, Error, InviteFormErrors } from '../../../types'
import { validatorFor } from '../../../lib/validators'

type Validator = (value: string) => Error

function buildError(value: string | null, validators: Validator[]): Error[] {
  return validators
    .map((validator: any) => {
      const errorKey = validator(value)
      const hasError = errorKey !== null

      return hasError ? errorKey : ''
    })
    .filter(Boolean)
}

export function buildFormState(form: InviteForm, property: keyof Omit<InviteForm, 'errors'>, value: string): InviteForm {
  return { ...form, [property]: value }
}

export function buildFormError(form: InviteForm, property: keyof Omit<InviteForm, 'errors'>, value: string): InviteFormErrors {
  const args = property === 'confirmEmail' ? [form.email, form.confirmEmail] : []

  return {
    ...form.errors,
    [property]: buildError(value, validatorFor(property, ...args)),
  }
}

export function validateForm(form: Omit<InviteForm, 'errors'>) {
  const { name, email, confirmEmail } = form

  return {
    name: buildError(name, validatorFor('name')),
    email: buildError(email, validatorFor('email')),
    confirmEmail: buildError(confirmEmail, validatorFor('confirmEmail', email, confirmEmail)),
  }
}