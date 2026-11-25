'use client'

import { useActionState, useEffect, useRef, useState, type ReactNode } from 'react'

import type { FormState } from '@/lib/customers/actions'

export type AuthField = {
  name: string
  label: string
  type?: 'text' | 'email' | 'tel' | 'password'
  autoComplete?: string
  hint?: string
  validate: (value: string) => string | undefined
}

type Props = {
  action: (previous: FormState, formData: FormData) => Promise<FormState>
  fields: AuthField[]
  submitLabel: string
  pendingLabel: string
  hidden?: Record<string, string>
  honeypot?: boolean
  footer?: ReactNode
  successNotice?: boolean
}

export function AuthForm({ action, fields, submitLabel, pendingLabel, hidden, honeypot, footer, successNotice }: Props) {
  const [state, formAction, pending] = useActionState(action, {})
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({})
  const [shown, setShown] = useState<Record<string, boolean>>({})
  const [values, setValues] = useState<Record<string, string>>({})
  const formRef = useRef<HTMLFormElement>(null)
  const lastFocused = useRef<FormState | null>(null)

  const errors = { ...(state.errors ?? {}), ...clientErrors }

  useEffect(() => {
    if (!state.errors || lastFocused.current === state) return
    lastFocused.current = state
    const first = fields.find((field) => state.errors?.[field.name])
    if (first) formRef.current?.querySelector<HTMLInputElement>(`[name="${first.name}"]`)?.focus()
  }, [state, fields])

  const check = (field: AuthField, value: string) => {
    const message = field.validate(value)
    setClientErrors((current) => {
      const next = { ...current }
      if (message) next[field.name] = message
      else delete next[field.name]
      return next
    })
    return message
  }

  const submit = (formData: FormData) => {
    const problems = fields.filter((field) => check(field, String(formData.get(field.name) ?? '')))
    if (problems.length > 0) {
      formRef.current?.querySelector<HTMLInputElement>(`[name="${problems[0]!.name}"]`)?.focus()
      return
    }
    formAction(formData)
  }

  return (
    <form ref={formRef} action={submit} noValidate className="mt-8 max-w-md space-y-5">
      {Object.entries(hidden ?? {}).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}

      {fields.map((field) => {
        const error = errors[field.name]
        const describedBy = [error ? `${field.name}-error` : '', field.hint ? `${field.name}-hint` : ''].filter(Boolean).join(' ')
        const isPassword = field.type === 'password'
        return (
          <div key={field.name}>
            <label htmlFor={`f-${field.name}`} className="field-label">
              {field.label}
            </label>
            <div className="relative">
              <input
                id={`f-${field.name}`}
                name={field.name}
                type={isPassword && shown[field.name] ? 'text' : (field.type ?? 'text')}
                autoComplete={field.autoComplete}
                autoCapitalize="none"
                spellCheck={false}
                aria-invalid={Boolean(error)}
                aria-describedby={describedBy || undefined}
                onBlur={(event) => {
                  const next = event.relatedTarget
                  if (next instanceof HTMLButtonElement && next.type === 'submit') return
                  check(field, event.currentTarget.value)
                }}
                value={values[field.name] ?? ''}
                onChange={(event) => {
                  const { value } = event.currentTarget
                  setValues((current) => ({ ...current, [field.name]: value }))
                  if (errors[field.name]) check(field, value)
                }}
                className={`field-input ${isPassword ? 'pr-28' : ''}`}
              />
              {isPassword && (
                <button
                  type="button"
                  aria-pressed={Boolean(shown[field.name])}
                  onClick={() => setShown((current) => ({ ...current, [field.name]: !current[field.name] }))}
                  className="absolute inset-y-0 right-1 my-1 min-h-11 rounded-full px-3 text-sm font-semibold text-forest underline"
                >
                  {shown[field.name] ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              )}
            </div>
            {field.hint && (
              <p id={`${field.name}-hint`} className="mt-1 text-sm text-muted">
                {field.hint}
              </p>
            )}
            {error && (
              <p id={`${field.name}-error`} className="field-error">
                {error}
              </p>
            )}
          </div>
        )
      })}

      {honeypot && (
        <div aria-hidden className="absolute left-[-9999px]">
          <label>
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
      )}

      <div aria-live="polite">
        {state.message && state.status === 'error' && (
          <p role="alert" className="field-error">
            {state.message}
          </p>
        )}
        {state.message && state.status === 'ok' && successNotice !== false && (
          <p className="border-l-2 border-forest pl-4 text-forest">{state.message}</p>
        )}
      </div>

      <button type="submit" className="btn btn-primary w-full sm:w-auto">
        {pending ? pendingLabel : submitLabel}
      </button>
      {footer}
    </form>
  )
}
