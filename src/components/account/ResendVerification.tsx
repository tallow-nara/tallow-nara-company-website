'use client'

import { useActionState } from 'react'

import { resendVerificationAction, type FormState } from '@/lib/customers/actions'

export function ResendVerification() {
  const [state, action, pending] = useActionState<FormState>(() => resendVerificationAction(), {})

  return (
    <form action={action} className="mt-4">
      <button type="submit" className="btn btn-outline">
        {pending ? 'Mengirim email…' : 'Kirim ulang email verifikasi'}
      </button>
      <div aria-live="polite" className="mt-3">
        {state.message && (
          <p className={state.status === 'ok' ? 'text-forest' : 'field-error'}>{state.message}</p>
        )}
      </div>
    </form>
  )
}
