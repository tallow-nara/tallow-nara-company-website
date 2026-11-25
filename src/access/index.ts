import type { Access, FieldAccess, PayloadRequest } from 'payload'

type Role = 'super-admin' | 'admin'

type StaffLike = { id: number | string; collection?: string; role?: Role | null } | null | undefined

export const isStaffUser = (user: StaffLike): boolean => Boolean(user) && (user?.collection ?? 'users') === 'users'
export const isSuperAdminUser = (user: StaffLike): boolean => isStaffUser(user) && user?.role === 'super-admin'

const userOf = (req: PayloadRequest) => req.user as StaffLike

export const staffOnly: Access = ({ req }) => isStaffUser(userOf(req))
export const superAdminOnly: Access = ({ req }) => isSuperAdminUser(userOf(req))
export const nobody: Access = () => false

export const selfOrSuperAdmin: Access = ({ req }) => {
  const user = userOf(req)
  if (!isStaffUser(user)) return false
  if (isSuperAdminUser(user)) return true
  return { id: { equals: user!.id } }
}

export const superAdminField: FieldAccess = ({ req }) => isSuperAdminUser(userOf(req))

export const hiddenUnlessSuperAdmin = ({ user }: { user?: unknown }): boolean => !isSuperAdminUser(user as StaffLike)
