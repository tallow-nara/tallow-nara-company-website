import type { ReactNode } from 'react'

export function AuthShell({ title, lead, children }: { title: string; lead?: string; children: ReactNode }) {
  return (
    <div className="page-shell flex-1 pb-24 pt-12 sm:pt-16">
      <h1 className="display">{title}</h1>
      {lead && <p className="mt-4 max-w-xl text-muted">{lead}</p>}
      {children}
    </div>
  )
}
