import { describe, expect, it } from 'vitest'

import { combinations, parseVariants, summarize, syncItems, variantLabel, variantProblems, type VariantConfig } from './variants'

const volume = { id: 'vol', name: 'Volume', values: [{ id: 'v30', label: '30 ml' }, { id: 'v50', label: '50 ml' }] }
const scent = { id: 'sc', name: 'Varian', values: [{ id: 'unsc', label: 'Unscented' }, { id: 'lav', label: 'Lavender' }] }

let counter = 0
const makeId = () => `n${(counter += 1)}`

describe('combinations', () => {
  it('membuat semua pasangan, dikelompokkan per pilihan pertama', () => {
    expect(combinations([volume, scent])).toEqual([
      ['v30', 'unsc'],
      ['v30', 'lav'],
      ['v50', 'unsc'],
      ['v50', 'lav'],
    ])
  })

  it('mengabaikan pilihan tanpa nilai', () => {
    expect(combinations([volume, { id: 'x', name: 'Varian', values: [] }])).toEqual([['v30'], ['v50']])
  })
})

describe('syncItems', () => {
  it('mempertahankan harga dan stok kombinasi yang sudah ada', () => {
    const config: VariantConfig = {
      options: [volume],
      items: [{ id: 'a', valueIds: ['v30'], price: 90000, stock: 4, weightGrams: 100, active: true }],
    }
    const items = syncItems(config, { price: 1, weightGrams: 1 }, makeId)
    expect(items[0]).toMatchObject({ id: 'a', price: 90000, stock: 4 })
    expect(items[1]).toMatchObject({ valueIds: ['v50'], price: 1, stock: 0, active: true })
  })

  it('menurunkan harga ke kombinasi baru saat pilihan kedua ditambahkan', () => {
    const config: VariantConfig = {
      options: [volume, scent],
      items: [{ id: 'a', valueIds: ['v50'], price: 150000, stock: 2, weightGrams: 200, active: true }],
    }
    const items = syncItems(config, { price: 1, weightGrams: 1 }, makeId)
    expect(items.filter((item) => item.valueIds[0] === 'v50').map((item) => item.price)).toEqual([150000, 150000])
    expect(new Set(items.map((item) => item.id)).size).toBe(items.length)
  })

  it('membuang kombinasi yang nilainya dihapus', () => {
    const config: VariantConfig = {
      options: [{ ...volume, values: [volume.values[1]] }],
      items: [
        { id: 'a', valueIds: ['v30'], price: 1, stock: 1, weightGrams: 1, active: true },
        { id: 'b', valueIds: ['v50'], price: 2, stock: 2, weightGrams: 2, active: true },
      ],
    }
    expect(syncItems(config, { price: 0, weightGrams: 0 }, makeId).map((item) => item.id)).toEqual(['b'])
  })
})

describe('ringkasan dan label', () => {
  const config: VariantConfig = {
    options: [volume, scent],
    items: [
      { id: 'a', valueIds: ['v30', 'lav'], price: 90000, stock: 3, weightGrams: 120, active: true },
      { id: 'b', valueIds: ['v50', 'lav'], price: 150000, stock: 5, weightGrams: 200, active: true },
      { id: 'c', valueIds: ['v50', 'unsc'], price: 10, stock: 99, weightGrams: 1, active: false },
    ],
  }

  it('hanya menghitung kombinasi yang dijual', () => {
    expect(summarize(config)).toEqual({ price: 90000, maxPrice: 150000, stock: 8, weightGrams: 120 })
  })

  it('menyusun nama kombinasi', () => {
    expect(variantLabel(config, config.items[1])).toBe('50 ml · Lavender')
  })

  it('data rusak dianggap kosong', () => {
    expect(parseVariants({ options: 'x' })).toEqual({ options: [], items: [] })
  })
})

describe('variantProblems', () => {
  it('meminta nama, nilai, harga, dan berat', () => {
    const problems = variantProblems({
      options: [{ id: 'a', name: '', values: [{ id: 'x', label: '30 ml' }, { id: 'y', label: '30 ML' }] }],
      items: [{ id: 'i', valueIds: ['x'], price: 0, stock: 0, weightGrams: 0, active: true }],
    })
    expect(problems.join(' ')).toMatch(/nama pilihan/)
    expect(problems.join(' ')).toMatch(/sama/)
    expect(problems.join(' ')).toMatch(/harga/)
    expect(problems.join(' ')).toMatch(/berat/)
  })

  it('lolos untuk data lengkap', () => {
    expect(
      variantProblems({
        options: [volume],
        items: [{ id: 'i', valueIds: ['v30'], price: 1000, stock: 0, weightGrams: 100, active: true }],
      }),
    ).toEqual([])
  })
})
