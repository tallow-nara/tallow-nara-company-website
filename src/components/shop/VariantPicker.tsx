'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'

import type { CartVariant, ShopOptionGroup } from '@/lib/shop-types'

import { addToCart } from './cart-store'
import { Price } from './Price'
import { QuantityStepper } from './QuantityStepper'

type Props = {
  productId: number
  productName: string
  isExamplePrice?: boolean | null
  options: ShopOptionGroup[]
  variants: CartVariant[]
}

export function VariantPicker({ productId, productName, isExamplePrice, options, variants }: Props) {
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(options.filter((group) => group.values.length === 1).map((group) => [group.id, group.values[0].id])),
  )
  const [quantity, setQuantity] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [added, setAdded] = useState(false)
  const groupRefs = useRef<Record<string, HTMLFieldSetElement | null>>({})

  const chosenIds = options.map((group) => selected[group.id])
  const variant = chosenIds.every(Boolean)
    ? variants.find((item) => item.valueIds.every((valueId, index) => valueId === chosenIds[index]))
    : undefined
  const prices = variants.map((item) => item.price)

  const availability = (groupIndex: number, valueId: string): 'ok' | 'empty' | 'none' => {
    const matches = variants.filter(
      (item) =>
        item.valueIds[groupIndex] === valueId &&
        options.every((group, index) => index === groupIndex || !selected[group.id] || item.valueIds[index] === selected[group.id]),
    )
    if (matches.length === 0) return 'none'
    return matches.some((item) => item.stock > 0) ? 'ok' : 'empty'
  }

  const choose = (groupId: string, valueId: string) => {
    setSelected((current) => ({ ...current, [groupId]: valueId }))
    setQuantity(1)
    setError(null)
    setAdded(false)
  }

  const add = () => {
    const missing = options.find((group) => !selected[group.id])
    if (missing) {
      setError(`Pilih ${missing.name.toLowerCase()} lebih dulu.`)
      groupRefs.current[missing.id]?.querySelector<HTMLInputElement>('input:not(:disabled)')?.focus()
      return
    }
    if (!variant) {
      setError('Kombinasi ini tidak dijual. Pilih kombinasi lain.')
      return
    }
    addToCart({ productId, variantId: variant.id }, Math.min(quantity, variant.stock), variant.stock)
    setError(null)
    setAdded(true)
  }

  return (
    <div>
      <Price
        amount={variant ? variant.price : Math.min(...prices)}
        maxAmount={variant ? undefined : Math.max(...prices)}
        isExample={isExamplePrice}
        className="text-2xl font-semibold"
      />

      <div className="mt-6 space-y-5">
        {options.map((group, groupIndex) => (
          <fieldset
            key={group.id}
            ref={(element) => {
              groupRefs.current[group.id] = element
            }}
          >
            <legend className="mb-2 text-base font-semibold text-ink">
              {group.name}
              {selected[group.id] && (
                <span className="ml-2 font-normal text-muted">
                  {group.values.find((value) => value.id === selected[group.id])?.label}
                </span>
              )}
            </legend>
            <div className="flex flex-wrap gap-2">
              {group.values.map((value) => {
                const state = availability(groupIndex, value.id)
                const isSelected = selected[group.id] === value.id
                return (
                  <label
                    key={value.id}
                    className={[
                      'relative inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-[var(--radius-sm)] border bg-white px-3 py-1.5 text-base transition-colors duration-150',
                      'has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-forest',
                      isSelected ? 'border-forest bg-paper font-semibold text-olive-deep' : 'border-stone text-ink hover:border-olive',
                      state !== 'ok' ? 'cursor-not-allowed border-dashed text-muted hover:border-stone' : '',
                    ].join(' ')}
                  >
                    <input
                      type="radio"
                      name={`pilihan-${group.id}`}
                      value={value.id}
                      checked={isSelected}
                      disabled={state !== 'ok'}
                      onChange={() => choose(group.id, value.id)}
                      className="sr-only"
                    />
                    {value.imageUrl && (
                      <span className="relative block h-9 w-9 shrink-0 overflow-hidden rounded-md bg-paper">
                        <Image src={value.imageUrl} alt="" fill sizes="36px" className="object-cover" />
                      </span>
                    )}
                    <span>{value.label}</span>
                    {state === 'empty' && <span className="text-sm">(habis)</span>}
                  </label>
                )
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="mt-6">
        {variant && variant.stock <= 0 ? (
          <p className="font-semibold text-error">Stok habis untuk pilihan ini</p>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <QuantityStepper
              value={quantity}
              max={variant ? variant.stock : 99}
              label={`Jumlah ${productName}`}
              onChange={setQuantity}
            />
            <button type="button" onClick={add} className="btn btn-primary flex-1">
              Masukkan ke keranjang
            </button>
          </div>
        )}
        {variant && variant.stock > 0 && <p className="mt-2 text-base text-muted">Stok tersedia {variant.stock}</p>}
        <p role="status" aria-live="polite" className="mt-2 min-h-6 text-sm">
          {error && <span className="text-error">{error}</span>}
          {added && !error && (
            <span className="text-forest">
              Sudah masuk. <Link href="/keranjang">Buka keranjang</Link>
            </span>
          )}
        </p>
      </div>
    </div>
  )
}
