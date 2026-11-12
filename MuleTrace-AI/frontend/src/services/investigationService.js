import api, { cleanParams, unwrap } from './api'

export const investigationService = {
  list: async (params = {}, { signal } = {}) =>
    unwrap(
      await api.get('/investigations', {
        params: cleanParams(params),
        signal,
      }),
    ),

  getById: async (investigationId, { signal } = {}) =>
    unwrap(
      await api.get(
        `/investigations/${encodeURIComponent(investigationId)}`,
        { signal },
      ),
    ),

  create: async (payload, { signal } = {}) =>
    unwrap(await api.post('/investigations', payload, { signal })),

  updateNotes: async (investigationId, notes, { signal } = {}) =>
    unwrap(
      await api.patch(
        `/investigations/${encodeURIComponent(investigationId)}`,
        { notes },
        { signal },
      ),
    ),
}
