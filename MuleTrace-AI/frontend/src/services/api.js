import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 20000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token =
    typeof window !== 'undefined'
      ? window.localStorage.getItem('muletrace.token')
      : null

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export function unwrap(response) {
  const payload = response?.data

  if (
    payload &&
    typeof payload === 'object' &&
    !Array.isArray(payload) &&
    Object.hasOwn(payload, 'data')
  ) {
    return payload.data
  }

  return payload
}

export function cleanParams(params = {}) {
  return Object.entries(params).reduce((output, [key, value]) => {
    if (value === undefined || value === null || value === '') return output
    output[key] = value
    return output
  }, {})
}

const STATUS_MESSAGES = {
  400: 'The request could not be completed. Review your input and try again.',
  401: 'Your session is no longer authorised. Sign in again to continue.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested record could not be found. Refresh the page and try again.',
  408: 'The backend request timed out. Try again in a moment.',
  409: 'The request conflicts with the latest data. Refresh and try again.',
  422: 'Some submitted information is invalid. Review your input and try again.',
  429: 'Too many requests have been sent. Wait a moment and try again.',
}

export function getErrorMessage(
  error,
  fallback = 'Something went wrong while contacting the MuleTrace API.',
) {
  if (!error) return fallback
  if (error.code === 'ERR_CANCELED') return ''
  if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
    return 'The backend request timed out. Try again in a moment.'
  }
  if (!error.response) {
    return 'Backend unavailable. Confirm the MuleTrace FastAPI service is running and try again.'
  }

  const status = error.response.status

  if (status >= 500) {
    return 'The MuleTrace backend is temporarily unavailable. Try again shortly.'
  }

  return STATUS_MESSAGES[status] ?? fallback
}

export default api
