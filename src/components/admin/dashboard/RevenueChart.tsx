'use client'

import { useEffect, useRef, useState } from 'react'

type Point = { key: string; label: string; fullLabel: string; value: number }

const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 })
const compact = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  notation: 'compact',
  maximumFractionDigits: 1,
})

const PAD = { top: 16, right: 16, bottom: 32, left: 64 }

function niceMax(value: number): number {
  if (value <= 0) return 1_000_000
  const power = 10 ** Math.floor(Math.log10(value))
  const step = [1, 2, 2.5, 5, 10].find((m) => m * power >= value) ?? 10
  return step * power
}

export function RevenueChart({ data }: { data: Point[] }) {
  const [active, setActive] = useState<number | null>(null)
  const box = useRef<HTMLDivElement>(null)
  const [W, setW] = useState(640)
  useEffect(() => {
    const el = box.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setW(Math.max(280, Math.round(entry.contentRect.width))))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  const H = W < 480 ? 200 : 260
  const max = niceMax(Math.max(...data.map((d) => d.value)))
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom
  const x = (i: number) => PAD.left + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW)
  const y = (v: number) => PAD.top + innerH - (v / max) * innerH
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * max)

  const line = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(d.value)}`).join(' ')
  const area = `${line} L${x(data.length - 1)},${y(0)} L${x(0)},${y(0)} Z`
  const slot = innerW / Math.max(data.length - 1, 1)
  const current = active === null ? null : data[active]

  return (
    <div className="tln-chart" ref={box} onMouseLeave={() => setActive(null)}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Grafik pendapatan per bulan. Angka lengkap ada di tabel di bawahnya.">
        {ticks.map((tick) => (
          <g key={tick}>
            <line className="tln-chart__grid" x1={PAD.left} x2={W - PAD.right} y1={y(tick)} y2={y(tick)} />
            <text className="tln-chart__axis" x={PAD.left - 10} y={y(tick)} dy="0.35em" textAnchor="end">
              {tick === 0 ? 'Rp0' : compact.format(tick)}
            </text>
          </g>
        ))}
        {data.map((d, i) => (
          <text key={d.key} className="tln-chart__axis" x={x(i)} y={H - 8} textAnchor="middle">
            {d.label}
          </text>
        ))}
        <path className="tln-chart__area" d={area} />
        <path className="tln-chart__line" d={line} />
        {active !== null && (
          <line className="tln-chart__cross" x1={x(active)} x2={x(active)} y1={PAD.top} y2={y(0)} />
        )}
        {data.map((d, i) => (
          <circle
            key={d.key}
            className="tln-chart__dot"
            data-active={active === i || undefined}
            cx={x(i)}
            cy={y(d.value)}
            r={active === i ? 6 : 4}
          />
        ))}
        {data.map((d, i) => (
          <rect
            key={d.key}
            className="tln-chart__hit"
            x={x(i) - slot / 2}
            y={PAD.top}
            width={slot}
            height={innerH}
            tabIndex={0}
            aria-label={`${d.fullLabel}: ${rupiah.format(d.value)}`}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
          />
        ))}
      </svg>
      {current && active !== null && (
        <div
          className="tln-chart__tip"
          style={{ left: `${(x(active) / W) * 100}%`, top: `${(y(current.value) / H) * 100}%` }}
          aria-hidden="true"
        >
          <span>{current.fullLabel}</span>
          <strong>{rupiah.format(current.value)}</strong>
        </div>
      )}
      <table className="tln-sr-only">
        <caption>Pendapatan per bulan</caption>
        <thead>
          <tr>
            <th scope="col">Bulan</th>
            <th scope="col">Pendapatan</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.key}>
              <td>{d.fullLabel}</td>
              <td>{rupiah.format(d.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
