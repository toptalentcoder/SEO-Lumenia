'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:7778/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Sign-in failed.')
      }

      let data = await response.json()
      if (!data.user) {
        data = {
          user: {
            name: data.name,
            email: data.email,
            role: data.role,
          },
          token: data.token,
        }
      }

      localStorage.setItem('authToken', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setSuccess('Sign-in successful! Redirecting...')
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error occurred.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">

      <section
        className="py-24 bg-blue-50"
        style={{
          backgroundImage: "url('/images/welcome/section-bg2.png')",
          backgroundSize: 'auto',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center top',
        }}
      >
        <div className="container mx-auto px-4 mt-28">
          <div className="w-3/4 mx-auto mb-24">
            <h2 className="text-[37.328px] font-bold text-gray-900">Log in!</h2>
            <div className="w-24 h-1 bg-green-400 mt-4 ml-4"></div>
          </div>

          <div className="w-3/4 mx-auto bg-white p-8">
            <div className="space-y-6 text-left">
              <h4 className="text-[21.328px] font-bold text-gray-900">Log in!</h4>

              <form className="space-y-4" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-sm text-red-700">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 text-sm text-green-700">
                    {success}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-[16px] font-semibold text-gray-900">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border-2 border-gray-300 px-4 py-3 text-gray-900"
                  />
                </div>

                <div className="mt-6">
                  <label htmlFor="password" className="block text-[16px] font-semibold text-gray-900">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border-2 border-gray-300 px-4 py-3 text-gray-900"
                  />
                </div>

                <div className="flex items-center mt-8">
                  <input
                    type="checkbox"
                    id="cgu"
                    checked={false}
                    onChange={() => {}}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="cgu" className="ml-2 text-[16px] font-semibold text-[#001F3F]">
                    Remember me
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-6 w-full py-3.5 px-10 text-white bg-[#001F3F] hover:bg-[#4517AD] text-[16px] font-medium rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Logging in...' : 'Submit'}
                </button>

                <div className="mt-6 text-center">
                  <Link href="/auth/forgot-password" className="text-blue-600 font-medium hover:underline">
                    Forgot your password?
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
