import api, { cleanParams, unwrap } from './api'

export const dashboardService = {
  getSummary: async ({ signal } = {}) =>
    unwrap(await api.get('/dashboard/summary', { signal })),

  getRiskTrend: async (params = {}, { signal } = {}) =>
    unwrap(
      await api.get('/dashboard/risk-trend', {
        params: cleanParams(params),
        signal,
      }),
    ),

  getAlertBreakdown: async (params = {}, { signal } = {}) =>
    unwrap(
      await api.get('/dashboard/alert-breakdown', {
        params: cleanParams(params),
        signal,
      }),
    ),
}
