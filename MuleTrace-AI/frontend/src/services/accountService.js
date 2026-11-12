import api, { cleanParams, unwrap } from './api'

export const accountService = {
  list: async (params = {}, { signal } = {}) =>
    unwrap(
      await api.get('/accounts', {
        params: cleanParams(params),
        signal,
      }),
    ),

  getById: async (accountId, { signal } = {}) =>
    unwrap(
      await api.get(`/accounts/${encodeURIComponent(accountId)}`, { signal }),
    ),
}
