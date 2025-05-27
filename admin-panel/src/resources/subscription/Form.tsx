'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Subscription } from '@/types/subscription'

const schema = z.object({
  // ✅ Add your fields here:
  name: z.string().min(1, 'Name is required'),
  // email: z.string().email('Invalid email'),
})

type FormData = z.infer<typeof schema>

export default function SubscriptionForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    console.log('Submitted:', data)
    // TODO: call API create/update here
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Name
        </label>
        <input
          {...register('name')}
          id="name"
          className="mt-1 block w-full border px-3 py-2 rounded-md"
        />
        {errors.name && (
          <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-md"
      >
        Submit
      </button>
    </form>
  )
}
