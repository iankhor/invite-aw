
import { InviteForm } from '../../types'
import { buildFormState, buildFormError, validateForm } from './lib/utils'

export type RequestInviteState = {
  form: InviteForm ,
  errors: string | ''
}

export type Action =
  | { type: 'change' | 'blur'; property: any; value: string }
  | { type: 'submit'; serverErrors: string }
  | { type: 'validate' }
  | { type: 'reset' }
  

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
      return {
        ...state,
        form: {
          ...buildFormState(state.form, action.property, action.value),
          errors: buildFormError(state.form, action.property, action.value)
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

    case 'reset':
      return initialFormState

    case 'submit':
      return {
        ...state,
        errors: action.serverErrors
      }
    default:
      return state
  }
}

export { validateForm }