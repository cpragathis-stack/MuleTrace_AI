import api, { cleanParams, unwrap } from './api'

export const networkService = {
  getGraph: async (params = {}, { signal } = {}) =>
    unwrap(
      await api.get('/network/graph', {
        params: cleanParams(params),
        signal,
      }),
    ),
}
