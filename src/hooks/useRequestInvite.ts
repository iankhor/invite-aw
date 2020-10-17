import React, { useState } from 'react'
import axios from 'axios'
import { RequestPayload } from './../types'

export const URL = 'https://l94wc2001h.execute-api.ap-southeast-2.amazonaws.com/prod/fake-auth'

export default function useRequestInvite() {
  const [loading, setLoading] = useState<boolean | null>(null)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function request(payload: RequestPayload) {
    setLoading(true)
    try {
      await axios.post(URL, payload)

      setSuccess(true)
      setLoading(false)
    } catch (e) {
      setSuccess(false)
      setLoading(false)
      setError(e.response.data.errorMessage)
    }
  }

  return {
    request,
    loading,
    success,
    error,
  }
}
