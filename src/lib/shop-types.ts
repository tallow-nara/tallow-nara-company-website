import type { Media, Product } from '@/payload-types'

import type { OrderStatus } from './orders/status'
import { parseVariants, variantLabel } from './products/variants'

export type CartVariant = {
  id: string
  label: string
  valueIds: string[]
  price: number
  stock: number
  imageUrl: string | null
}

export type ShopOptionGroup = {
  id: string
  name: string
  values: { id: string; label: string; imageUrl: string | null; imageAlt: string }[]
}

export type CartProduct = {
  id: number
  slug: string
  name: string
  sizeLabel: string | null
  price: number
  isExamplePrice: boolean
  stock: number
  imageUrl: string | null
  imageAlt: string
  options: ShopOptionGroup[]
  variants: CartVariant[]
}

export function firstImage(product: Product): Media | null {
  const image = product.images?.[0]
  return image && typeof image !== 'number' ? image : null
}

function mediaById(product: Product, id: number | null | undefined): Media | null {
  if (!id) return null
  const found = product.images?.find((image) => typeof image !== 'number' && image.id === id)
  return found && typeof found !== 'number' ? found : null
}

export function shopVariants(product: Product): Pick<CartProduct, 'options' | 'variants'> {
  if (!product.hasVariants) return { options: [], variants: [] }
  const config = parseVariants(product.variants)
  const options = config.options.map((group) => ({
    id: group.id,
    name: group.name,
    values: group.values.map((value) => {
      const media = mediaById(product, value.imageId)
      return { id: value.id, label: value.label, imageUrl: media?.url ?? null, imageAlt: media?.alt ?? value.label }
    }),
  }))
  const imageOf = (valueIds: string[]) =>
    valueIds.map((valueId) => options.flatMap((group) => group.values).find((value) => value.id === valueId)?.imageUrl).find(Boolean) ?? null
  const variants = config.items
    .filter((item) => item.active)
    .map((item) => ({
      id: item.id,
      label: variantLabel(config, item),
      valueIds: item.valueIds,
      price: item.price,
      stock: item.stock,
      imageUrl: imageOf(item.valueIds),
    }))
  return { options, variants }
}

export function toCartProduct(product: Product): CartProduct {
  const image = firstImage(product)
  return {
    ...shopVariants(product),
    id: product.id,
    slug: product.slug,
    name: product.name,
    sizeLabel: product.sizeLabel ?? null,
    price: product.price ?? 0,
    isExamplePrice: product.isExamplePrice ?? false,
    stock: product.stock ?? 0,
    imageUrl: image?.url ?? null,
    imageAlt: image?.alt ?? product.name,
  }
}

export type PublicOrder = {
  code: string
  status: OrderStatus
  createdAt: string
  expiresAt: string
  items: { name: string; quantity: number; unitPrice: number }[]
  subtotal: number
  shippingCost: number
  total: number
  courierName: string
  serviceName: string
  trackingNumber: string | null
  areaLabel: string
  paymentUrl: string | null
  history: { status: string; at: string }[]
}

export type CartRow = {
  key: { productId: number; variantId?: string }
  quantity: number
  product: CartProduct
  variantLabel: string | null
  price: number
  stock: number
  imageUrl: string | null
}

export function resolveCartLines(
  lines: { productId: number; variantId?: string; quantity: number }[],
  products: CartProduct[],
): { rows: CartRow[]; missing: number } {
  const rows = lines.flatMap((line): CartRow[] => {
    const product = products.find((candidate) => candidate.id === line.productId)
    if (!product) return []
    const key = { productId: line.productId, variantId: line.variantId }
    if (product.variants.length === 0) {
      if (line.variantId) return []
      return [{ key, quantity: line.quantity, product, variantLabel: null, price: product.price, stock: product.stock, imageUrl: product.imageUrl }]
    }
    const variant = product.variants.find((candidate) => candidate.id === line.variantId)
    if (!variant) return []
    return [
      {
        key,
        quantity: line.quantity,
        product,
        variantLabel: variant.label,
        price: variant.price,
        stock: variant.stock,
        imageUrl: variant.imageUrl ?? product.imageUrl,
      },
    ]
  })
  return { rows, missing: lines.length - rows.length }
}
