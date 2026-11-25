import { z } from 'zod'

export const MAX_OPTION_GROUPS = 2
export const MAX_OPTION_VALUES = 20

const id = z.string().min(1).max(40)
const whole = z.number().int().min(0)

export const optionValueSchema = z.object({
  id,
  label: z.string(),
  imageId: z.number().int().positive().nullish(),
})

export const optionGroupSchema = z.object({
  id,
  name: z.string(),
  values: z.array(optionValueSchema).max(MAX_OPTION_VALUES),
})

export const variantItemSchema = z.object({
  id,
  valueIds: z.array(id).min(1).max(MAX_OPTION_GROUPS),
  price: whole,
  stock: whole,
  weightGrams: whole,
  active: z.boolean(),
})

export const variantConfigSchema = z.object({
  options: z.array(optionGroupSchema).max(MAX_OPTION_GROUPS),
  items: z.array(variantItemSchema),
})

export type OptionValue = z.infer<typeof optionValueSchema>
export type OptionGroup = z.infer<typeof optionGroupSchema>
export type VariantItem = z.infer<typeof variantItemSchema>
export type VariantConfig = z.infer<typeof variantConfigSchema>

export const EMPTY_VARIANTS: VariantConfig = { options: [], items: [] }

export function newId(): string {
  const bytes = new Uint8Array(6)
  globalThis.crypto.getRandomValues(bytes)
  return Array.from(bytes, (b) => b.toString(36).padStart(2, '0')).join('').slice(0, 10)
}

export function parseVariants(value: unknown): VariantConfig {
  const parsed = variantConfigSchema.safeParse(value)
  return parsed.success ? parsed.data : EMPTY_VARIANTS
}

export function combinations(options: OptionGroup[]): string[][] {
  const groups = options.filter((group) => group.values.length > 0)
  if (groups.length === 0) return []
  return groups.reduce<string[][]>(
    (acc, group) => acc.flatMap((prefix) => group.values.map((value) => [...prefix, value.id])),
    [[]],
  )
}

const sameIds = (a: string[], b: string[]) => a.length === b.length && a.every((value, i) => value === b[i])

export function syncItems(
  config: VariantConfig,
  defaults: { price: number; weightGrams: number },
  makeId: () => string = newId,
): VariantItem[] {
  return combinations(config.options).map((valueIds) => {
    const existing =
      config.items.find((item) => sameIds(item.valueIds, valueIds)) ??
      config.items.find((item) => item.valueIds.length < valueIds.length && sameIds(item.valueIds, valueIds.slice(0, item.valueIds.length)))
    return existing
      ? { ...existing, id: sameIds(existing.valueIds, valueIds) ? existing.id : makeId(), valueIds }
      : { id: makeId(), valueIds, price: defaults.price, stock: 0, weightGrams: defaults.weightGrams, active: true }
  })
}

export function variantLabel(config: VariantConfig, item: Pick<VariantItem, 'valueIds'>): string {
  return item.valueIds
    .map((valueId) => config.options.flatMap((group) => group.values).find((value) => value.id === valueId)?.label ?? '?')
    .join(' · ')
}

export function variantProblems(config: VariantConfig): string[] {
  const problems: string[] = []
  if (config.options.length === 0) problems.push('Tambahkan minimal satu jenis pilihan, misalnya Volume.')
  config.options.forEach((group, index) => {
    const name = group.name.trim() || `Pilihan ${index + 1}`
    if (!group.name.trim()) problems.push(`Isi nama pilihan ke-${index + 1}, misalnya Volume atau Varian.`)
    if (group.values.length === 0) problems.push(`Tambahkan minimal satu nilai untuk ${name}.`)
    if (group.values.some((value) => !value.label.trim())) problems.push(`Ada nilai ${name} yang masih kosong.`)
    const labels = group.values.map((value) => value.label.trim().toLowerCase()).filter(Boolean)
    if (new Set(labels).size !== labels.length) problems.push(`Ada nilai ${name} yang sama. Setiap nilai harus berbeda.`)
  })
  const names = config.options.map((group) => group.name.trim().toLowerCase()).filter(Boolean)
  if (new Set(names).size !== names.length) problems.push('Nama kedua pilihan tidak boleh sama.')
  const active = config.items.filter((item) => item.active)
  if (config.items.length > 0 && active.length === 0) problems.push('Minimal satu kombinasi harus dijual.')
  if (active.some((item) => item.price <= 0)) problems.push('Isi harga untuk setiap kombinasi yang dijual.')
  if (active.some((item) => item.weightGrams <= 0)) problems.push('Isi berat kirim untuk setiap kombinasi yang dijual.')
  return problems
}

export function summarize(config: VariantConfig): { price: number; maxPrice: number; stock: number; weightGrams: number } | null {
  const active = config.items.filter((item) => item.active)
  if (active.length === 0) return null
  return {
    price: Math.min(...active.map((item) => item.price)),
    maxPrice: Math.max(...active.map((item) => item.price)),
    stock: active.reduce((sum, item) => sum + item.stock, 0),
    weightGrams: Math.min(...active.map((item) => item.weightGrams)),
  }
}
