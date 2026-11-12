import api, { cleanParams, unwrap } from './api'

export const alertService = {
  list: async (params = {}, { signal } = {}) =>
    unwrap(
      await api.get('/alerts', {
        params: cleanParams(params),
        signal,
      }),
    ),

  getById: async (alertId, { signal } = {}) =>
    unwrap(await api.get(`/alerts/${encodeURIComponent(alertId)}`, { signal })),

  updateStatus: async (alertId, status) =>
    unwrap(
      await api.patch(`/alerts/${encodeURIComponent(alertId)}`, { status }),
    ),
}
