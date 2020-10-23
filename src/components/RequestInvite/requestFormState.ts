
import { InviteForm, RequestInviteState, Error } from '../../types'

type Validator = (value: string) => Error

export type Action =
  | { type: 'change' | 'blur'; property: 'name' | 'email' | 'confirmEmail'; value: string }
  | { type: 'submit'; serverErrors: string }
  | { type: 'validate' }
  

function isBlank(str: string) {
  return !str || (typeof str === 'string' && !str.match(/\S/gm)) ? 'blank' : null
}

function isSameValue(valueOne: string | null, valueTwo?: string | null) {
  return valueOne && valueTwo && valueOne === valueTwo ? null : 'different'
}

function isEmailValid(email: string) {
  return email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? null : 'invalid'
}

function isShort(str: string) {
  return str && str.length >= 3 ? null : 'short'
}

function buildError(value: string | null, validators: Validator[]): Error[] {
  return validators
    .map((validator: any) => {
      const errorKey = validator(value)
      const hasError = errorKey !== null

      return hasError ? errorKey : ''
    })
    .filter(Boolean)
}

function validatorFor(property: string, value: string | null = null, comparedValue: string | null = null) {
  const validators = {
    name: [isBlank, isShort],
    email: [isBlank, isEmailValid],
    confirmEmail: [() => isSameValue(value, comparedValue)],
    default: [],
  } as Record<string, any>

  return validators[property] || validators.default
}

function buildFormState(form: InviteForm, property: keyof InviteForm, value: string): InviteForm {
  return { ...form, [property]: value }
}

function validateForm(form: Omit<InviteForm, 'errors'>) {
  const { name, email, confirmEmail } = form

  return {
    name: buildError(name, validatorFor('name')),
    email: buildError(email, validatorFor('email')),
    confirmEmail: buildError(confirmEmail, validatorFor('confirmEmail', email, confirmEmail)),
  }
}

export const initialFormState = {
  form: { 
    name: null, 
    email: null, 
    confirmEmail: null, 
    errors: { 
      name: null, 
      email: null, 
      confirmEmail: null 
    } 
  },
  errors: ''
}

export default function inviteFormReducer(state: RequestInviteState , action: Action) {
  switch (action.type) {
    case 'change':
      return {
        ...state,
        form: buildFormState(state.form, action.property, action.value)
      }
    case 'blur':
      const args = action.property === 'confirmEmail' ? [state.form?.email, state.form?.confirmEmail] : []

      return {
        ...state,
        form: {
          ...buildFormState(state.form, action.property, action.value),
          errors: {
            ...state.form?.errors,
            [action.property]: buildError(action.value, validatorFor(action.property, ...args)),
          }
        }
      }
    case 'validate':
      return {
        ...state,
        form: {
          ...state.form,
          errors: validateForm(state.form)
        }
      }
    case 'submit':
      return {
        ...state,
        errors: action.serverErrors
      }
    default:
      return state
  }
}
