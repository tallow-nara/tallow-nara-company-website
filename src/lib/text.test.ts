import { describe, expect, it } from 'vitest'

import { slugify, toParagraphs } from './text'

describe('toParagraphs', () => {
  it('memisahkan paragraf pada baris kosong', () => {
    expect(toParagraphs('Satu.\n\nDua.')).toEqual(['Satu.', 'Dua.'])
  })

  it('menangani akhir baris Windows dan baris kosong berisi spasi', () => {
    expect(toParagraphs('Satu.\r\n\r\nDua.\n   \nTiga.')).toEqual(['Satu.', 'Dua.', 'Tiga.'])
  })

  it('mempertahankan baris tunggal dalam satu paragraf', () => {
    expect(toParagraphs('Baris satu\nbaris dua')).toEqual(['Baris satu\nbaris dua'])
  })

  it('mengembalikan daftar kosong untuk nilai kosong', () => {
    expect(toParagraphs(null)).toEqual([])
    expect(toParagraphs(undefined)).toEqual([])
    expect(toParagraphs('  \n\n ')).toEqual([])
  })
})

describe('slugify', () => {
  it('membuat alamat URL yang rapi', () => {
    expect(slugify('Pemenang Pertama UMi Youthpreneur 2025')).toBe('pemenang-pertama-umi-youthpreneur-2025')
    expect(slugify('3 Teratas Kategori Perawatan Diri, DCE Telkomsel 2026')).toBe(
      '3-teratas-kategori-perawatan-diri-dce-telkomsel-2026',
    )
    expect(slugify('Pencapaian & acara')).toBe('pencapaian-dan-acara')
    expect(slugify('  Café — Jakarta!  ')).toBe('cafe-jakarta')
  })
})
