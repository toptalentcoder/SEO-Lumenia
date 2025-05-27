import Topbar from '@/components/Topbar'
import dynamic from 'next/dynamic'
const UserList = dynamic(() => import('@/resources/user/List'))

export default async function Page() {
    return (
      <div className="min-h-screen bg-gray-50">
        <Topbar />
        <main className="p-6">
          <UserList />
        </main>
      </div>
    )

}
