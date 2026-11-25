'use client'

import Link from 'next/link'
import { useState } from 'react'

import { addToCart, type LineKey } from './cart-store'
import { QuantityStepper } from './QuantityStepper'

type AddToCartProps = {
  productId: number
  variantId?: string
  productName: string
  stock: number
  compact?: boolean
}

export function AddToCart({ productId, variantId, productName, stock, compact }: AddToCartProps) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  if (stock <= 0) {
    return <p className="font-semibold text-error">Stok habis</p>
  }

  const add = () => {
    const key: LineKey = variantId ? { productId, variantId } : { productId }
    addToCart(key, compact ? 1 : Math.min(quantity, stock), stock)
    setAdded(true)
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        {!compact && (
          <QuantityStepper value={quantity} max={stock} label={`Jumlah ${productName}`} onChange={setQuantity} />
        )}
        <button
          type="button"
          onClick={add}
          aria-label={`Masukkan ${productName} ke keranjang`}
          className={`btn ${compact ? 'btn-outline w-full' : 'btn-primary flex-1'}`}
        >
          Masukkan ke keranjang
        </button>
      </div>
      <p role="status" className="mt-2 min-h-6 text-sm text-forest">
        {added && (
          <>
            Sudah masuk. <Link href="/keranjang">Buka keranjang</Link>
          </>
        )}
      </p>
    </div>
  )
}
