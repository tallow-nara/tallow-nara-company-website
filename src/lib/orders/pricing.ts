import { parseVariants, variantLabel } from '../products/variants'

export type PricedProduct = {
  id: number
  name: string
  price: number
  weightGrams: number
  stock: number
  isVisible: boolean
  hasVariants?: boolean | null
  variants?: unknown
}

export type RequestedItem = { productId: number; variantId?: string | null; quantity: number }

export type PricedItem = {
  productId: number
  variantId?: string
  variantLabel?: string
  name: string
  unitPrice: number
  quantity: number
  weightGrams: number
}

export type PricingResult =
  | { ok: true; items: PricedItem[]; subtotal: number; totalWeightGrams: number }
  | { ok: false; message: string }

type Sellable = Omit<PricedItem, 'quantity'> & { stock: number }

function resolve(product: PricedProduct, variantId: string | null | undefined): Sellable | string {
  if (!product.hasVariants) {
    return { productId: product.id, name: product.name, unitPrice: product.price, weightGrams: product.weightGrams, stock: product.stock }
  }
  const config = parseVariants(product.variants)
  const item = config.items.find((candidate) => candidate.id === variantId && candidate.active)
  if (!item) return `Pilihan ${product.name} di keranjang sudah tidak tersedia. Hapus lalu pilih ulang.`
  const label = variantLabel(config, item)
  return {
    productId: product.id,
    variantId: item.id,
    variantLabel: label,
    name: `${product.name} (${label})`,
    unitPrice: item.price,
    weightGrams: item.weightGrams,
    stock: item.stock,
  }
}

export function priceItems(requested: RequestedItem[], products: PricedProduct[]): PricingResult {
  if (requested.length === 0) return { ok: false, message: 'Keranjang Anda masih kosong.' }

  const items: PricedItem[] = []
  for (const { productId, variantId, quantity } of requested) {
    const product = products.find((candidate) => candidate.id === productId)
    if (!product || !product.isVisible) {
      return { ok: false, message: 'Salah satu produk sudah tidak tersedia. Periksa keranjang Anda.' }
    }
    const sellable = resolve(product, variantId)
    if (typeof sellable === 'string') return { ok: false, message: sellable }
    if (!Number.isInteger(quantity) || quantity < 1) {
      return { ok: false, message: `Jumlah ${sellable.name} tidak valid.` }
    }
    const alreadyAsked = items
      .filter((item) => item.productId === productId && item.variantId === sellable.variantId)
      .reduce((sum, item) => sum + item.quantity, 0)
    if (quantity + alreadyAsked > sellable.stock) {
      return {
        ok: false,
        message: `Stok ${sellable.name} tersisa ${sellable.stock}. Kurangi jumlahnya di keranjang.`,
      }
    }
    items.push({
      productId: sellable.productId,
      ...(sellable.variantId ? { variantId: sellable.variantId, variantLabel: sellable.variantLabel } : {}),
      name: sellable.name,
      unitPrice: sellable.unitPrice,
      quantity,
      weightGrams: sellable.weightGrams,
    })
  }

  return {
    ok: true,
    items,
    subtotal: items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    totalWeightGrams: items.reduce((sum, item) => sum + item.weightGrams * item.quantity, 0),
  }
}
