import { useState } from 'react'
import { Loader2, NotebookPen } from 'lucide-react'
import EmptyState from '../common/EmptyState'

export default function NotesEditor({
  initialNotes = '',
  onSave,
  saving = false,
  error,
  saved = false,
  disabled = false,
}) {
  const [notes, setNotes] = useState(initialNotes)

  if (disabled) {
    return (
      <EmptyState
        icon={NotebookPen}
        title="No investigation notes"
        description="Start an investigation to record investigative context, hypotheses and next steps."
        className="border-0 bg-transparent px-2 py-10"
      />
    )
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (saving) return
    onSave(notes)
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="investigation-notes" className="sr-only">
        Investigation notes
      </label>
      <textarea
        id="investigation-notes"
        rows={6}
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        className="field min-h-36 resize-y leading-6"
        placeholder="Record investigative context, hypotheses and next steps…"
        disabled={saving}
      />

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-5 text-muted">
          Notes are stored against the active investigation.
        </p>
        <button
          type="submit"
          className="btn btn-primary shrink-0"
          disabled={saving}
        >
          {saving ? (
            <Loader2 size={15} className="animate-spin" aria-hidden="true" />
          ) : (
            <NotebookPen size={15} aria-hidden="true" />
          )}
          {saving ? 'Saving…' : 'Save notes'}
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-3 text-xs text-rose-300">
          {error}
        </p>
      )}
      {saved && !error && (
        <p role="status" className="mt-3 text-xs text-emerald-300">
          Notes saved.
        </p>
      )}
    </form>
  )
}
