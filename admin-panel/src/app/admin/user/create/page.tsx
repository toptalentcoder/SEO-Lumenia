import dynamic from 'next/dynamic'
const UserForm = dynamic(() => import('@/resources/user/Form'))

export default function Page() {
    return <UserForm />
}
