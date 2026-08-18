'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import slugify from 'slugify'
import { Field, SaveBar, inputCls } from '@/components/admin/AdminFormFields'

export default function GalleryAlbumEditor({ album }: { album: any }) {
  const router = useRouter()
  const isEdit = !!album
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [title, setTitle] = useState(album?.title || '')
  const [slug, setSlug] = useState(album?.slug || '')
  const [description, setDescription] = useState(album?.description || '')
  const [category, setCategory] = useState(album?.category || '')
  const [isPublished, setIsPublished] = useState(album?.isPublished ?? false)

  function handleTitleChange(val: string) {
    setTitle(val)
    if (!isEdit) setSlug(slugify(val, { lower: true, strict: true }))
  }

  async function save() {
    setSaving(true); setError('')
    const body = { title, slug, description: description||null, category: category||null, isPublished }
    try {
      const url = isEdit ? `/api/admin/gallery/${album.id}` : '/api/admin/gallery'
      const res = await fetch(url, { method: isEdit?'PATCH':'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
      if (!res.ok) { const d=await res.json(); throw new Error(d.error||'Failed') }
      router.push('/admin/gallery'); router.refresh()
    } catch(e:any) { setError(e.message); setSaving(false) }
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Album Title" required><input value={title} onChange={e=>handleTitleChange(e.target.value)} className={inputCls} /></Field>
        <Field label="Slug" required><input value={slug} onChange={e=>setSlug(e.target.value)} className={inputCls} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Category"><input value={category} onChange={e=>setCategory(e.target.value)} className={inputCls} placeholder="e.g. Events, Projects" /></Field>
      </div>
      <Field label="Description">
        <textarea value={description} onChange={e=>setDescription(e.target.value)} rows={3} className={`${inputCls} resize-none`} />
      </Field>
      <label className="flex items-center gap-2 text-sm text-[#aaa] cursor-pointer">
        <input type="checkbox" checked={isPublished} onChange={e=>setIsPublished(e.target.checked)} className="accent-[#C9A84C]" />
        Published (visible publicly)
      </label>
      {isEdit && album.items?.length > 0 && (
        <div>
          <span className="text-xs text-[#666] font-mono uppercase tracking-wider block mb-3">Media — upload files via Media Library then reference URLs</span>
          <div className="grid grid-cols-4 gap-2">
            {album.items.map((item: any) => (
              <div key={item.id} className="aspect-square bg-[#111] border border-[#222] relative overflow-hidden">
                {item.media.type === 'IMAGE' && (
                  <img src={item.media.url} alt={item.caption||''} className="w-full h-full object-cover opacity-70" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <SaveBar saving={saving} onSave={save} isEdit={isEdit} />
    </div>
  )
}
