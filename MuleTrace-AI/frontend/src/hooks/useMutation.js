import { useCallback, useState } from 'react'
import { getErrorMessage } from '../services/api'

export default function useMutation(mutation) {
  const [state, setState] = useState({
    data: null,
    error: null,
    loading: false,
  })

  const execute = useCallback(
    async (...args) => {
      setState({ data: null, error: null, loading: true })

      try {
        const data = await mutation(...args)
        setState({ data, error: null, loading: false })
        return data
      } catch (error) {
        if (error?.code === 'ERR_CANCELED') return null

        setState({
          data: null,
          error: getErrorMessage(error),
          loading: false,
        })
        return null
      }
    },
    [mutation],
  )

  const reset = useCallback(() => {
    setState({ data: null, error: null, loading: false })
  }, [])

  return { ...state, execute, reset }
}
