import { Nav } from '@/components/nav'
import { PageHeader } from '@/components/page-header'
import { EmployerOverview } from '@/components/employer-overview'
import { StreamsList } from '@/components/streams-list'
import { CreateStreamModal } from '@/components/create-stream-modal'
import { mockStreams } from '@/lib/mock-streams'

export default function EmployerDashboard() {
  const activeStreams = mockStreams.filter((s) => s.status === 'active')

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <PageHeader
            title="Employer Dashboard"
            description="Manage salary streams for your team"
            action={<CreateStreamModal />}
          />

          <EmployerOverview streams={mockStreams} />

          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-xl font-bold brutal-title">Active Streams</h2>
              <div className="flex-1 brutal-divider" />
            </div>
            <StreamsList streams={activeStreams} />
          </div>

          {mockStreams.filter((s) => s.status !== 'active').length > 0 && (
            <div className="mt-10">
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-xl font-bold brutal-title">Completed & Terminated</h2>
                <div className="flex-1 brutal-divider" />
              </div>
              <StreamsList streams={mockStreams.filter((s) => s.status !== 'active')} />
            </div>
          )}
        </div>
      </main>
    </>
  )
}
