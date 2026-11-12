import api, { unwrap } from './api'

export const assistantService = {
  chat: async (payload, { signal } = {}) =>
    unwrap(await api.post('/assistant/chat', payload, { signal })),
}
