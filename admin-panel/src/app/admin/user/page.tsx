import dynamic from 'next/dynamic'
const UserList = dynamic(() => import('@/resources/user/List'))

export default async function Page() {
  return <UserList />
}
