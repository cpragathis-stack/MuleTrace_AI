import { useCallback, useEffect, useState } from 'react'
import { getErrorMessage } from '../services/api'

export default function useApi(request, { enabled = true } = {}) {
  const [state, setState] = useState(() => ({
    request,
    enabled,
    data: null,
    error: null,
    loading: enabled,
  }))

  const refetch = useCallback(
    async (options = {}) => {
      if (!enabled) return null

      setState({ request, enabled, data: null, error: null, loading: true })

      try {
        const data = await request(options)
        setState({ request, enabled, data, error: null, loading: false })
        return data
      } catch (error) {
        if (error?.code === 'ERR_CANCELED') return null

        setState({
          request,
          enabled,
          data: null,
          error: getErrorMessage(error),
          loading: false,
        })
        return null
      }
    },
    [enabled, request],
  )

  useEffect(() => {
    if (!enabled) return undefined

    let active = true
    const controller = new AbortController()

    const run = async () => {
      try {
        const data = await request({ signal: controller.signal })
        if (active) {
          setState({ request, enabled, data, error: null, loading: false })
        }
      } catch (error) {
        if (!active || error?.code === 'ERR_CANCELED') return

        setState({
          request,
          enabled,
          data: null,
          error: getErrorMessage(error),
          loading: false,
        })
      }
    }

    run()

    return () => {
      active = false
      controller.abort()
    }
  }, [enabled, request])

  const isStale = state.request !== request || state.enabled !== enabled

  return {
    data: enabled && !isStale ? state.data : null,
    error: enabled && !isStale ? state.error : null,
    loading: enabled && (isStale || state.loading),
    refetch,
  }
}
