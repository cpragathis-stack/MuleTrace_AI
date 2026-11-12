export function toItems(payload) {
  if (Array.isArray(payload)) return payload
  if (Array.isArray(payload?.items)) return payload.items
  if (Array.isArray(payload?.results)) return payload.results
  if (Array.isArray(payload?.data)) return payload.data
  return []
}

export function toPagination(payload) {
  if (!payload || Array.isArray(payload)) {
    return { total: null, page: 1, pageSize: null, pages: null }
  }

  return {
    total: Number.isFinite(Number(payload.total)) ? Number(payload.total) : null,
    page: Number.isFinite(Number(payload.page)) ? Number(payload.page) : 1,
    pageSize: Number.isFinite(Number(payload.page_size ?? payload.pageSize))
      ? Number(payload.page_size ?? payload.pageSize)
      : null,
    pages: Number.isFinite(Number(payload.pages ?? payload.total_pages))
      ? Number(payload.pages ?? payload.total_pages)
      : null,
  }
}
