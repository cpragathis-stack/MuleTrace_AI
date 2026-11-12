import { useCallback, useMemo, useState } from 'react'
import {
  ClipboardList,
  Loader2,
  Play,
  RefreshCw,
} from 'lucide-react'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import LoadingState from '../components/common/LoadingState'
import PageHeader from '../components/common/PageHeader'
import SectionCard from '../components/common/SectionCard'
import StatusBadge from '../components/common/StatusBadge'
import AccountSelector from '../components/investigation/AccountSelector'
import EvidencePanel from '../components/investigation/EvidencePanel'
import NetworkSummary from '../components/investigation/NetworkSummary'
import NotesEditor from '../components/investigation/NotesEditor'
import SuspiciousTimeline from '../components/investigation/SuspiciousTimeline'
import useApi from '../hooks/useApi'
import useDocumentTitle from '../hooks/useDocumentTitle'
import useMutation from '../hooks/useMutation'
import { accountService, investigationService } from '../services'
import { toItems } from '../utils/collections'
import { formatDateTime, truncate } from '../utils/formatters'

function getEvidence(investigation) {
  return toItems(
    investigation?.evidence ??
      investigation?.evidence_items ??
      investigation?.artifacts,
  )
}

function getTimeline(investigation) {
  return toItems(
    investigation?.suspicious_transactions ??
      investigation?.timeline ??
      investigation?.suspicious_activity,
  )
}

function getNetworkSummary(investigation) {
  return (
    investigation?.network_summary ??
    investigation?.network_analysis ??
    investigation?.network ??
    null
  )
}

function getNotes(investigation) {
  const notes = investigation?.notes

  if (typeof notes === 'string') return notes
  if (Array.isArray(notes)) {
    return notes
      .map((note) =>
        typeof note === 'string' ? note : note?.content ?? note?.text ?? '',
      )
      .filter(Boolean)
      .join('\n\n')
  }
  if (notes && typeof notes === 'object') {
    return notes.content ?? notes.text ?? ''
  }

  return ''
}

function getAccountReference(value) {
  if (value && typeof value === 'object') {
    return value.account_id ?? value.id ?? ''
  }

  return value ?? ''
}

function getAccountId(account) {
  return account?.account_id ?? account?.id ?? ''
}

function DetailItem({ label, children }) {
  return (
    <div>
      <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </dt>
      <dd className="mt-1.5 min-w-0 text-sm text-slate-200">{children}</dd>
    </div>
  )
}

export default function Investigation() {
  useDocumentTitle('Investigation')

  const [selectedAccountId, setSelectedAccountId] = useState('')
  const [activeId, setActiveId] = useState(null)
  const [createdInvestigation, setCreatedInvestigation] = useState(null)
  const [startError, setStartError] = useState(null)

  const fetchAccounts = useCallback(
    (options) => accountService.list({ limit: 100 }, options),
    [],
  )

  const fetchInvestigation = useCallback(
    (options) =>
      activeId
        ? investigationService.getById(activeId, options)
        : Promise.resolve(null),
    [activeId],
  )

  const saveNotes = useCallback(
    (notes) =>
      activeId
        ? investigationService.updateNotes(activeId, notes)
        : Promise.resolve(null),
    [activeId],
  )

  const accountsState = useApi(fetchAccounts)
  const detail = useApi(fetchInvestigation, { enabled: Boolean(activeId) })
  const startMutation = useMutation(investigationService.create)
  const notesMutation = useMutation(saveNotes)

  const accounts = useMemo(
    () => toItems(accountsState.data),
    [accountsState.data],
  )
  const hasValidAccount =
    Boolean(selectedAccountId) &&
    accounts.some((account) => {
      const identifier = getAccountId(account)
      return Boolean(identifier) && String(identifier) === selectedAccountId
    })

  const investigation = detail.data ?? createdInvestigation
  const isActive = Boolean(activeId || createdInvestigation)
  const status = investigation?.status ?? null
  const investigationId =
    investigation?.investigation_id ?? investigation?.id ?? activeId
  const accountReference = getAccountReference(
    investigation?.account_id ?? selectedAccountId,
  )
  const startedAt =
    investigation?.created_at ??
    investigation?.started_at ??
    investigation?.updated_at ??
    null

  const evidence = getEvidence(investigation)
  const timeline = getTimeline(investigation)
  const networkSummary = getNetworkSummary(investigation)
  const notes = getNotes(investigation)
  const detailLoading = detail.loading && isActive
  const notesKey = `${activeId ?? 'no-investigation'}-${
    detail.data ? 'detail' : 'created'
  }`

  const handleAccountChange = (value) => {
    const isValid = accounts.some((account) => {
      const identifier = getAccountId(account)
      return Boolean(identifier) && String(identifier) === value
    })

    setSelectedAccountId(isValid ? value : '')
    setActiveId(null)
    setCreatedInvestigation(null)
    setStartError(null)
    startMutation.reset()
    notesMutation.reset()
  }

  const handleStart = async () => {
    if (!hasValidAccount || startMutation.loading) return

    setStartError(null)
    notesMutation.reset()

    const created = await startMutation.execute({
      account_id: selectedAccountId,
    })

    if (!created) return

    const createdRecord =
      created && typeof created === 'object' ? created : { id: created }
    const identifier = createdRecord.investigation_id ?? createdRecord.id

    setCreatedInvestigation(createdRecord)

    if (!identifier) {
      setStartError(
        'The investigation was created, but the API response did not include an investigation identifier.',
      )
      return
    }

    setActiveId(String(identifier))
  }

  const handleRefresh = () => {
    if (isActive && activeId) {
      detail.refetch()
      return
    }

    accountsState.refetch()
  }

  const isRefreshing =
    (isActive && activeId && detail.loading) ||
    (!(isActive && activeId) && accountsState.loading)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Case workspace"
        title="Investigation workspace"
        description="Open an account investigation to assemble evidence, review suspicious transaction activity and assess linked-account exposure."
        actions={
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              size={15}
              className={isRefreshing ? 'animate-spin' : undefined}
              aria-hidden="true"
            />
            Refresh
          </button>
        }
      />

      <SectionCard
        title="Investigation status"
        description="Select the account scope and launch a new investigation."
        actions={status ? <StatusBadge status={status} /> : null}
      >
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <AccountSelector
            accounts={accounts}
            value={selectedAccountId}
            onChange={handleAccountChange}
            loading={accountsState.loading}
            error={accountsState.error}
            onRetry={() => accountsState.refetch()}
            disabled={startMutation.loading}
          />

          <button
            type="button"
            className="btn btn-primary w-full lg:w-auto"
            onClick={handleStart}
            disabled={
              !hasValidAccount ||
              accountsState.loading ||
              Boolean(accountsState.error) ||
              startMutation.loading
            }
            title={
              !hasValidAccount
                ? 'Select a valid account before starting an investigation.'
                : undefined
            }
          >
            {startMutation.loading ? (
              <Loader2
                size={15}
                className="animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Play size={15} aria-hidden="true" />
            )}
            {startMutation.loading ? 'Starting…' : 'Start investigation'}
          </button>
        </div>

        {(startMutation.error || startError) && (
          <ErrorState
            title="Investigation could not be started"
            message={startMutation.error ?? startError}
            onRetry={startMutation.error ? handleStart : undefined}
            retryLabel="Try again"
            className="mt-4"
          />
        )}

        {!isActive ? (
          <EmptyState
            icon={ClipboardList}
            title="No investigation active"
            description="Choose an account and start an investigation to populate the evidence, timeline and network analysis panels."
            className="mt-5 border-0 bg-transparent px-2 py-8"
          />
        ) : detailLoading && !investigation ? (
          <LoadingState
            compact
            label="Loading investigation…"
            className="mt-5 justify-start"
          />
        ) : (
          <div className="mt-5 border-t border-stroke/70 pt-5">
            {detail.error && (
              <ErrorState
                title="Investigation details unavailable"
                message={detail.error}
                onRetry={() => detail.refetch()}
                className="mb-5"
              />
            )}

            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <DetailItem label="Status">
                <StatusBadge status={status} />
              </DetailItem>
              <DetailItem label="Investigation ID">
                <span className="font-mono text-xs text-slate-300">
                  {investigationId
                    ? truncate(investigationId, 22)
                    : '—'}
                </span>
              </DetailItem>
              <DetailItem label="Account">
                <span className="font-mono text-xs text-slate-300">
                  {accountReference
                    ? truncate(accountReference, 22)
                    : '—'}
                </span>
              </DetailItem>
              <DetailItem label="Started">
                <span className="text-xs text-slate-400">
                  {formatDateTime(startedAt)}
                </span>
              </DetailItem>
            </dl>
          </div>
        )}
      </SectionCard>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <SuspiciousTimeline
            events={timeline}
            active={isActive}
            loading={detailLoading}
          />

          <SectionCard
            title="Investigation notes"
            description="Capture context, hypotheses and next steps for this case."
          >
            {detailLoading && isActive ? (
              <LoadingState compact label="Loading investigation notes…" />
            ) : (
              <NotesEditor
                key={notesKey}
                initialNotes={notes}
                onSave={(value) => notesMutation.execute(value)}
                saving={notesMutation.loading}
                error={notesMutation.error}
                saved={Boolean(notesMutation.data)}
                disabled={!isActive}
              />
            )}
          </SectionCard>
        </div>

        <aside className="space-y-6">
          <EvidencePanel
            evidence={evidence}
            active={isActive}
            loading={detailLoading}
          />
          <NetworkSummary
            summary={networkSummary}
            active={isActive}
            loading={detailLoading}
          />
        </aside>
      </div>
    </div>
  )
}
