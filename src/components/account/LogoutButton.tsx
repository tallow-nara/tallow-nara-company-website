import { logoutAction } from '@/lib/customers/actions'

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button type="submit" className="btn btn-outline">
        Keluar dari akun
      </button>
    </form>
  )
}
