import { Nav } from '@/components/nav'
import { PageHeader } from '@/components/page-header'
import { EmployeeOverview } from '@/components/employee-overview'
import { EmployeeStreamsList } from '@/components/employee-streams-list'
import { mockEmployeeStreams } from '@/lib/mock-employee'

export default function EmployeeDashboard() {
  const activeStreams = mockEmployeeStreams.filter((s) => s.status === 'active')

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <PageHeader
            title="Employee Dashboard"
            description="Track and withdraw from your salary streams"
          />

          <EmployeeOverview streams={mockEmployeeStreams} />

          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-xl font-bold brutal-title">Your Streams</h2>
              <div className="flex-1 brutal-divider" />
            </div>
            <EmployeeStreamsList streams={activeStreams} />
          </div>

          {mockEmployeeStreams.filter((s) => s.status !== 'active').length > 0 && (
            <div className="mt-10">
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-xl font-bold brutal-title">Completed Streams</h2>
                <div className="flex-1 brutal-divider" />
              </div>
              <EmployeeStreamsList streams={mockEmployeeStreams.filter((s) => s.status !== 'active')} />
            </div>
          )}
        </div>
      </main>
    </>
  )
}
