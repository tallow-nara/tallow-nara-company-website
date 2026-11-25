'use client'

import { useCallback, useSyncExternalStore } from 'react'

export type CartLine = { productId: number; variantId?: string; quantity: number }

export type LineKey = { productId: number; variantId?: string }

const sameLine = (line: LineKey, key: LineKey) =>
  line.productId === key.productId && (line.variantId ?? null) === (key.variantId ?? null)

export const lineKeyOf = (key: LineKey) => `${key.productId}:${key.variantId ?? ''}`

const KEY = 'tallownara-keranjang'
const EMPTY: CartLine[] = []
const listeners = new Set<() => void>()

let cachedRaw: string | null = null
let cachedLines: CartLine[] = EMPTY

function getSnapshot(): CartLine[] {
  const raw = window.localStorage.getItem(KEY)
  if (raw === cachedRaw) return cachedLines
  cachedRaw = raw
  try {
    cachedLines = raw ? (JSON.parse(raw) as CartLine[]) : EMPTY
  } catch {
    cachedLines = EMPTY
  }
  return cachedLines
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  window.addEventListener('storage', listener)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', listener)
  }
}

function write(lines: CartLine[]) {
  if (lines.length === 0) window.localStorage.removeItem(KEY)
  else window.localStorage.setItem(KEY, JSON.stringify(lines))
  listeners.forEach((listener) => listener())
}

export function addToCart(key: LineKey, quantity: number, maxStock: number) {
  const lines = getSnapshot()
  const existing = lines.find((line) => sameLine(line, key))
  const nextQuantity = Math.min((existing?.quantity ?? 0) + quantity, maxStock)
  const entry: CartLine = key.variantId
    ? { productId: key.productId, variantId: key.variantId, quantity: nextQuantity }
    : { productId: key.productId, quantity: nextQuantity }
  write(existing ? lines.map((line) => (sameLine(line, key) ? entry : line)) : [...lines, entry])
}

export function setCartQuantity(key: LineKey, quantity: number) {
  write(
    getSnapshot()
      .map((line) => (sameLine(line, key) ? { ...line, quantity } : line))
      .filter((line) => line.quantity > 0),
  )
}

export function removeFromCart(key: LineKey) {
  write(getSnapshot().filter((line) => !sameLine(line, key)))
}

export function clearCart() {
  write(EMPTY)
}

export function useCart(): CartLine[] {
  return useSyncExternalStore(subscribe, getSnapshot, useCallback(() => EMPTY, []))
}

const noopSubscribe = () => () => undefined

export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  )
}
