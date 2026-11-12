import api, { cleanParams, unwrap } from './api'

export const transactionService = {
  list: async (params = {}, { signal } = {}) =>
    unwrap(
      await api.get('/transactions', {
        params: cleanParams(params),
        signal,
      }),
    ),

  getById: async (transactionId, { signal } = {}) =>
    unwrap(
      await api.get(`/transactions/${encodeURIComponent(transactionId)}`, {
        signal,
      }),
    ),
}
