import SemrushCard from '@/components/dashboard/SemrushCard'
import SerpApiCard from '@/components/dashboard/SerpApiCard'
import SerperCard from '@/components/dashboard/SerperCard'
import Topbar from '@/components/Topbar'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <main className="p-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <SerpApiCard />
          <SemrushCard />
          <SerperCard />
          <div className="bg-white p-4 rounded shadow">📊 2,986 Active Users</div>
        </div>
      </main>
    </div>
  )
}
