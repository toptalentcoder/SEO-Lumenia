import Topbar from '@/components/Topbar'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded shadow">🟢 75% Sales</div>
          <div className="bg-white p-4 rounded shadow">💰 $4,300 Revenue</div>
          <div className="bg-white p-4 rounded shadow">🧍 6,782 Clients</div>
          <div className="bg-white p-4 rounded shadow">📊 2,986 Active Users</div>
        </div>
      </main>
    </div>
  )
}
