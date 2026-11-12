import { Link } from 'react-router-dom'
import { FileSearch } from 'lucide-react'
import EmptyState from '../components/common/EmptyState'
import PageHeader from '../components/common/PageHeader'
import useDocumentTitle from '../hooks/useDocumentTitle'

export default function NotFound() {
  useDocumentTitle('Page not found')

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="404"
        title="Page not found"
        description="The requested workspace view does not exist or has moved."
      />

      <EmptyState
        icon={FileSearch}
        title="Nothing to investigate here"
        description="Check the address or return to the investigation overview to continue reviewing fraud signals."
        action={
          <Link to="/" className="btn btn-primary">
            Back to overview
          </Link>
        }
      />
    </div>
  )
}
