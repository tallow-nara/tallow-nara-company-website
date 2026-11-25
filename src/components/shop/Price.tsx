import { formatRupiah } from '@/lib/money'

export function Price({
  amount,
  maxAmount,
  isExample,
  className = 'text-lg font-semibold',
}: {
  amount: number
  maxAmount?: number
  isExample?: boolean | null
  className?: string
}) {
  return (
    <p className={`tabular text-ink ${className}`}>
      {formatRupiah(amount)}
      {maxAmount !== undefined && maxAmount > amount && <> – {formatRupiah(maxAmount)}</>}
      {isExample && <span className="template-chip ml-2 text-sm font-normal">harga contoh</span>}
    </p>
  )
}
