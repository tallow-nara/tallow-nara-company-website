'use client'

import { useConfig, useField, useFormFields } from '@payloadcms/ui'
import type { JSONFieldClientComponent } from 'payload'
import { useEffect, useMemo, useRef, useState } from 'react'

import {
  MAX_OPTION_GROUPS,
  MAX_OPTION_VALUES,
  newId,
  parseVariants,
  summarize,
  syncItems,
  variantProblems,
  type OptionGroup,
  type VariantConfig,
  type VariantItem,
} from '@/lib/products/variants'

import './variant-field.css'

type Photo = { id: number; url: string; alt: string }

const rupiah = new Intl.NumberFormat('id-ID')
const digits = (text: string) => {
  const cleaned = text.replace(/\D/g, '').slice(0, 10)
  return cleaned === '' ? 0 : Number(cleaned)
}

function useProductPhotos(): Photo[] {
  const raw = useFormFields(([fields]) => fields.images?.value) as unknown
  const { config } = useConfig()
  const ids = useMemo(
    () =>
      (Array.isArray(raw) ? raw : [])
        .map((entry) => (typeof entry === 'object' && entry ? (entry as { id?: number }).id : entry))
        .filter((id): id is number => typeof id === 'number'),
    [raw],
  )
  const key = ids.join(',')
  const [photos, setPhotos] = useState<Photo[]>([])

  useEffect(() => {
    if (!key) return
    const controller = new AbortController()
    fetch(`${config.serverURL ?? ''}${config.routes.api}/media?where[id][in]=${key}&limit=50&depth=0`, {
      credentials: 'include',
      signal: controller.signal,
    })
      .then((response) => (response.ok ? response.json() : { docs: [] }))
      .then((data: { docs: { id: number; url?: string; thumbnailURL?: string; alt?: string }[] }) =>
        setPhotos(
          key
            .split(',')
            .map(Number)
            .map((id) => data.docs.find((doc) => doc.id === id))
            .filter((doc): doc is NonNullable<typeof doc> => Boolean(doc?.url))
            .map((doc) => ({ id: doc.id, url: doc.thumbnailURL || doc.url || '', alt: doc.alt ?? '' })),
        ),
      )
      .catch(() => undefined)
    return () => controller.abort()
  }, [key, config.serverURL, config.routes.api])

  return key ? photos : []
}

function PhotoPicker(props: { photos: Photo[]; value?: number | null; label: string; onChange: (id: number | null) => void }) {
  const [open, setOpen] = useState(false)
  const current = props.photos.find((photo) => photo.id === props.value)
  return (
    <div className="tln-v-photo">
      <button
        type="button"
        className="tln-v-photo__btn"
        aria-expanded={open}
        aria-label={current ? `Ganti foto ${props.label}` : `Pasang foto untuk ${props.label}`}
        onClick={() => setOpen((value) => !value)}
      >
        {current ? <img src={current.url} alt="" /> : <span aria-hidden="true">+ Foto</span>}
      </button>
      {open && (
        <div className="tln-v-photo__menu" role="group" aria-label={`Foto untuk ${props.label}`}>
          {props.photos.length === 0 ? (
            <p>Unggah foto di kolom &quot;Foto produk&quot; di bawah lebih dulu, lalu pilih di sini.</p>
          ) : (
            <>
              {props.photos.map((photo) => (
                <button
                  key={photo.id}
                  type="button"
                  aria-pressed={photo.id === props.value}
                  aria-label={photo.alt || `Foto ${photo.id}`}
                  onClick={() => {
                    props.onChange(photo.id)
                    setOpen(false)
                  }}
                >
                  <img src={photo.url} alt="" />
                </button>
              ))}
              {props.value && (
                <button
                  type="button"
                  className="tln-v-photo__none"
                  onClick={() => {
                    props.onChange(null)
                    setOpen(false)
                  }}
                >
                  Tanpa foto
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

function NumberInput(props: { value: number; label: string; prefix?: string; suffix?: string; invalid?: boolean; onChange: (value: number) => void }) {
  return (
    <span className={`tln-v-num ${props.invalid ? 'tln-v-num--invalid' : ''}`}>
      {props.prefix && <span aria-hidden="true">{props.prefix}</span>}
      <input
        type="text"
        inputMode="numeric"
        aria-label={props.label}
        aria-invalid={props.invalid || undefined}
        value={props.value === 0 ? '' : rupiah.format(props.value)}
        placeholder="0"
        onChange={(event) => props.onChange(digits(event.target.value))}
      />
      {props.suffix && <span aria-hidden="true">{props.suffix}</span>}
    </span>
  )
}

export const VariantField: JSONFieldClientComponent = ({ path }) => {
  const { value, setValue, showError, errorMessage } = useField<unknown>({ path })
  const config = useMemo(() => parseVariants(value), [value])
  const basePrice = useFormFields(([fields]) => fields.price?.value) as number | undefined
  const baseWeight = useFormFields(([fields]) => fields.weightGrams?.value) as number | undefined
  const photos = useProductPhotos()
  const [bulk, setBulk] = useState({ price: 0, stock: 0, weightGrams: 0 })
  const focusNext = useRef<string | null>(null)

  useEffect(() => {
    if (!focusNext.current) return
    document.getElementById(focusNext.current)?.focus()
    focusNext.current = null
  })

  const defaults = { price: bulk.price || basePrice || 0, weightGrams: bulk.weightGrams || baseWeight || 0 }

  const commit = (options: OptionGroup[], items: VariantItem[] = config.items) => {
    const next: VariantConfig = { options, items }
    setValue({ options, items: syncItems(next, defaults) })
  }

  const updateGroup = (groupId: string, change: Partial<OptionGroup>) =>
    commit(config.options.map((group) => (group.id === groupId ? { ...group, ...change } : group)))

  const addGroup = (name: string) => {
    const valueId = newId()
    focusNext.current = `tln-v-${valueId}`
    commit([...config.options, { id: newId(), name, values: [{ id: valueId, label: '' }] }])
  }

  const addValue = (group: OptionGroup) => {
    const valueId = newId()
    focusNext.current = `tln-v-${valueId}`
    updateGroup(group.id, { values: [...group.values, { id: valueId, label: '' }] })
  }

  const updateItem = (itemId: string, change: Partial<VariantItem>) =>
    setValue({ ...config, items: config.items.map((item) => (item.id === itemId ? { ...item, ...change } : item)) })

  const applyBulk = () =>
    setValue({
      ...config,
      items: config.items.map((item) => ({
        ...item,
        price: bulk.price || item.price,
        stock: bulk.stock || item.stock,
        weightGrams: bulk.weightGrams || item.weightGrams,
      })),
    })

  const valueOf = (id: string) => config.options.flatMap((group) => group.values).find((value) => value.id === id)
  const problems = variantProblems(config)
  const summary = summarize(config)
  const [first, second] = config.options

  return (
    <div className="tln-v field-type">
      <section className="tln-v__card" aria-labelledby="tln-v-options-title">
        <header className="tln-v__head">
          <h3 id="tln-v-options-title">Jenis pilihan</h3>
          <p>Contoh: Volume (30 ml, 50 ml, 100 ml) dan Varian (Unscented, Lavender). Maksimal 2 jenis.</p>
        </header>

        {config.options.length === 0 && (
          <div className="tln-v__empty">
            <p>Belum ada pilihan. Mulai dari salah satu:</p>
            <div className="tln-v__suggest">
              <button type="button" className="tln-v-btn" onClick={() => addGroup('Volume')}>
                + Volume
              </button>
              <button type="button" className="tln-v-btn" onClick={() => addGroup('Varian')}>
                + Varian
              </button>
              <button type="button" className="tln-v-btn tln-v-btn--ghost" onClick={() => addGroup('')}>
                + Nama lain
              </button>
            </div>
          </div>
        )}

        {config.options.map((group, groupIndex) => (
          <div key={group.id} className="tln-v-group">
            <div className="tln-v-group__top">
              <label className="tln-v-label" htmlFor={`tln-v-name-${group.id}`}>
                Nama pilihan {groupIndex + 1}
              </label>
              <button
                type="button"
                className="tln-v-link tln-v-link--danger"
                onClick={() => commit(config.options.filter((candidate) => candidate.id !== group.id))}
              >
                Hapus pilihan ini
              </button>
            </div>
            <input
              id={`tln-v-name-${group.id}`}
              className="tln-v-input tln-v-input--name"
              value={group.name}
              placeholder={groupIndex === 0 ? 'Volume' : 'Varian'}
              maxLength={30}
              aria-invalid={!group.name.trim() || undefined}
              onChange={(event) => updateGroup(group.id, { name: event.target.value })}
            />

            <p className="tln-v-label">
              Nilai {group.name.trim() ? group.name.trim().toLowerCase() : `pilihan ${groupIndex + 1}`}
              {groupIndex === 0 && <span className="tln-v-hint"> · foto opsional, tampil di halaman produk</span>}
            </p>
            <ul className="tln-v-values">
              {group.values.map((optionValue, valueIndex) => (
                <li key={optionValue.id}>
                  {groupIndex === 0 && (
                    <PhotoPicker
                      photos={photos}
                      value={optionValue.imageId}
                      label={optionValue.label || `nilai ${valueIndex + 1}`}
                      onChange={(imageId) =>
                        updateGroup(group.id, {
                          values: group.values.map((candidate) => (candidate.id === optionValue.id ? { ...candidate, imageId } : candidate)),
                        })
                      }
                    />
                  )}
                  <input
                    id={`tln-v-${optionValue.id}`}
                    className="tln-v-input"
                    value={optionValue.label}
                    placeholder={groupIndex === 0 ? ['30 ml', '50 ml', '100 ml'][valueIndex % 3] : ['Unscented', 'Lavender', 'Citrus Floral'][valueIndex % 3]}
                    maxLength={40}
                    aria-label={`Nilai ${valueIndex + 1} untuk ${group.name || `pilihan ${groupIndex + 1}`}`}
                    aria-invalid={!optionValue.label.trim() || undefined}
                    onChange={(event) =>
                      updateGroup(group.id, {
                        values: group.values.map((candidate) =>
                          candidate.id === optionValue.id ? { ...candidate, label: event.target.value } : candidate,
                        ),
                      })
                    }
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault()
                        if (valueIndex === group.values.length - 1 && group.values.length < MAX_OPTION_VALUES) addValue(group)
                        else document.getElementById(`tln-v-${group.values[valueIndex + 1]?.id}`)?.focus()
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="tln-v-remove"
                    aria-label={`Hapus ${optionValue.label || `nilai ${valueIndex + 1}`}`}
                    disabled={group.values.length === 1}
                    onClick={() => updateGroup(group.id, { values: group.values.filter((candidate) => candidate.id !== optionValue.id) })}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
            {group.values.length < MAX_OPTION_VALUES && (
              <button type="button" className="tln-v-link" onClick={() => addValue(group)}>
                + Tambah nilai
              </button>
            )}
          </div>
        ))}

        {config.options.length > 0 && config.options.length < MAX_OPTION_GROUPS && (
          <button type="button" className="tln-v-btn tln-v-btn--ghost" onClick={() => addGroup(first?.name === 'Varian' ? 'Volume' : 'Varian')}>
            + Tambah pilihan kedua
          </button>
        )}
      </section>

      {config.items.length > 0 && (
        <section className="tln-v__card" aria-labelledby="tln-v-table-title">
          <header className="tln-v__head">
            <h3 id="tln-v-table-title">Harga, stok, dan berat per kombinasi</h3>
            <p>
              {config.items.length} kombinasi
              {summary && ` · total stok ${rupiah.format(summary.stock)} · harga Rp${rupiah.format(summary.price)}${summary.maxPrice > summary.price ? `–${rupiah.format(summary.maxPrice)}` : ''}`}
              . Hilangkan centang &quot;Dijual&quot; untuk kombinasi yang tidak tersedia.
            </p>
          </header>

          <div className="tln-v-bulk" role="group" aria-label="Isi sekaligus untuk semua kombinasi">
            <span className="tln-v-bulk__title">Isi semua sekaligus</span>
            <NumberInput label="Harga untuk semua" prefix="Rp" value={bulk.price} onChange={(price) => setBulk({ ...bulk, price })} />
            <NumberInput label="Stok untuk semua" value={bulk.stock} suffix="pcs" onChange={(stock) => setBulk({ ...bulk, stock })} />
            <NumberInput label="Berat untuk semua" value={bulk.weightGrams} suffix="g" onChange={(weightGrams) => setBulk({ ...bulk, weightGrams })} />
            <button type="button" className="tln-v-btn" onClick={applyBulk}>
              Terapkan ke semua
            </button>
          </div>

          <div className="tln-v-table-wrap">
            <table className="tln-v-table">
              <thead>
                <tr>
                  <th scope="col">{first?.name || 'Pilihan 1'}</th>
                  {second && <th scope="col">{second.name || 'Pilihan 2'}</th>}
                  <th scope="col">Harga</th>
                  <th scope="col">Stok</th>
                  <th scope="col">Berat kirim</th>
                  <th scope="col">Dijual</th>
                </tr>
              </thead>
              <tbody>
                {config.items.map((item, index) => {
                  const firstValue = valueOf(item.valueIds[0])
                  const groupStart = index === 0 || config.items[index - 1].valueIds[0] !== item.valueIds[0]
                  const span = config.items.filter((candidate) => candidate.valueIds[0] === item.valueIds[0]).length
                  const photo = photos.find((candidate) => candidate.id === firstValue?.imageId)
                  const name = item.valueIds.map((id) => valueOf(id)?.label || '…').join(' · ')
                  return (
                    <tr key={item.id} className={item.active ? undefined : 'tln-v-off'}>
                      {(groupStart || !second) && (
                        <th scope="row" rowSpan={second ? span : 1} className="tln-v-first">
                          <span>
                            {photo && <img src={photo.url} alt="" />}
                            {firstValue?.label || '…'}
                          </span>
                        </th>
                      )}
                      {second && <td>{valueOf(item.valueIds[1])?.label || '…'}</td>}
                      <td>
                        <NumberInput
                          label={`Harga ${name}`}
                          prefix="Rp"
                          value={item.price}
                          invalid={item.active && item.price <= 0}
                          onChange={(price) => updateItem(item.id, { price })}
                        />
                      </td>
                      <td>
                        <NumberInput label={`Stok ${name}`} value={item.stock} onChange={(stock) => updateItem(item.id, { stock })} />
                      </td>
                      <td>
                        <NumberInput
                          label={`Berat ${name}`}
                          suffix="g"
                          value={item.weightGrams}
                          invalid={item.active && item.weightGrams <= 0}
                          onChange={(weightGrams) => updateItem(item.id, { weightGrams })}
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          className="tln-v-check"
                          checked={item.active}
                          aria-label={`Jual ${name}`}
                          onChange={(event) => updateItem(item.id, { active: event.target.checked })}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {(showError || (config.options.length > 0 && problems.length > 0)) && (
        <div className={`tln-v-problems ${showError ? 'tln-v-problems--error' : ''}`} role={showError ? 'alert' : 'status'}>
          <p>{showError ? (errorMessage ?? 'Lengkapi pilihan produk sebelum menyimpan.') : 'Perlu dilengkapi sebelum disimpan:'}</p>
          {problems.length > 0 && (
            <ul>
              {problems.map((problem) => (
                <li key={problem}>{problem}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
