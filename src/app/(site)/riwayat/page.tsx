import { redirect } from 'next/navigation'

// Riwayat pesanan kini ada di halaman Akun.
export default function HistoryRedirect() {
  redirect('/akun')
}
