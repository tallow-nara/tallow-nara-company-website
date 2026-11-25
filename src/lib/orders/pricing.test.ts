import { describe, expect, it } from 'vitest'

import { priceItems, type PricedProduct } from './pricing'

const balm: PricedProduct = { id: 1, name: 'Balm', price: 150000, weightGrams: 200, stock: 3, isVisible: true }
const soap: PricedProduct = { id: 2, name: 'Sabun', price: 90000, weightGrams: 300, stock: 1, isVisible: true }

describe('priceItems', () => {
  it('memakai harga server dan menjumlahkan total', () => {
    const result = priceItems(
      [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 1 },
      ],
      [balm, soap],
    )
    expect(result).toMatchObject({ ok: true, subtotal: 390000, totalWeightGrams: 700 })
  })

  it('menolak jumlah melebihi stok', () => {
    expect(priceItems([{ productId: 2, quantity: 2 }], [soap]).ok).toBe(false)
  })

  it('menolak produk tersembunyi atau tidak dikenal', () => {
    expect(priceItems([{ productId: 1, quantity: 1 }], [{ ...balm, isVisible: false }]).ok).toBe(false)
    expect(priceItems([{ productId: 9, quantity: 1 }], [balm]).ok).toBe(false)
  })

  it('menolak jumlah bukan bilangan bulat positif dan keranjang kosong', () => {
    expect(priceItems([{ productId: 1, quantity: 0 }], [balm]).ok).toBe(false)
    expect(priceItems([{ productId: 1, quantity: 1.5 }], [balm]).ok).toBe(false)
    expect(priceItems([], [balm]).ok).toBe(false)
  })

  describe('produk berpilihan', () => {
    const tallow: PricedProduct = {
      id: 3,
      name: 'Tallow Balm',
      price: 1,
      weightGrams: 1,
      stock: 99,
      isVisible: true,
      hasVariants: true,
      variants: {
        options: [{ id: 'vol', name: 'Volume', values: [{ id: 'v30', label: '30 ml' }, { id: 'v50', label: '50 ml' }] }],
        items: [
          { id: 'a', valueIds: ['v30'], price: 90000, stock: 2, weightGrams: 120, active: true },
          { id: 'b', valueIds: ['v50'], price: 150000, stock: 5, weightGrams: 200, active: false },
        ],
      },
    }

    it('memakai harga, berat, dan nama kombinasi', () => {
      const result = priceItems([{ productId: 3, variantId: 'a', quantity: 2 }], [tallow])
      expect(result).toMatchObject({ ok: true, subtotal: 180000, totalWeightGrams: 240 })
      expect(result.ok && result.items[0]).toMatchObject({ name: 'Tallow Balm (30 ml)', variantId: 'a', variantLabel: '30 ml' })
    })

    it('menolak tanpa pilihan, pilihan tidak dijual, atau melebihi stok kombinasi', () => {
      expect(priceItems([{ productId: 3, quantity: 1 }], [tallow]).ok).toBe(false)
      expect(priceItems([{ productId: 3, variantId: 'b', quantity: 1 }], [tallow]).ok).toBe(false)
      expect(priceItems([{ productId: 3, variantId: 'a', quantity: 3 }], [tallow]).ok).toBe(false)
      expect(
        priceItems(
          [
            { productId: 3, variantId: 'a', quantity: 2 },
            { productId: 3, variantId: 'a', quantity: 1 },
          ],
          [tallow],
        ).ok,
      ).toBe(false)
    })
  })
})
