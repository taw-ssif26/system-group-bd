'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import slugify from 'slugify'
import { Field, SaveBar, inputCls, selectCls } from '@/components/admin/AdminFormFields'

const industries = ['REAL_ESTATE','CONSTRUCTION','ICT','TELECOM','TRADING','LIFESTYLE','AGRICULTURE','ELECTRONICS','GROOMING','INDUSTRIAL']

export default function BusinessEditor({ concern }: { concern: any }) {
  const router = useRouter()
  const isEdit = !!concern
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [name, setName] = useState(concern?.name || '')
  const [slug, setSlug] = useState(concern?.slug || '')
  const [shortDescription, setShortDescription] = useState(concern?.shortDescription || '')
  const [description, setDescription] = useState(concern?.description || '')
  const [industry, setIndustry] = useState(concern?.industry || 'REAL_ESTATE')
  const [website, setWebsite] = useState(concern?.website || '')
  const [displayOrder, setDisplayOrder] = useState(concern?.displayOrder?.toString() || '0')
  const [isFeatured, setIsFeatured] = useState(concern?.isFeatured || false)
  const [isPublished, setIsPublished] = useState(concern?.isPublished ?? true)

  function handleNameChange(val: string) {
    setName(val)
    if (!isEdit) setSlug(slugify(val, { lower: true, strict: true }))
  }

  async function save() {
    setSaving(true); setError('')
    const body = { name, slug, shortDescription, description, industry, website: website||null, displayOrder: parseInt(displayOrder)||0, isFeatured, isPublished }
    try {
      const url = isEdit ? `/api/admin/businesses/${concern.id}` : '/api/admin/businesses'
      const res = await fetch(url, { method: isEdit?'PATCH':'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
      if (!res.ok) { const d=await res.json(); throw new Error(d.error||'Failed') }
      router.push('/admin/businesses'); router.refresh()
    } catch(e:any) { setError(e.message); setSaving(false) }
  }

  async function handleDelete() {
    if (!confirm('Delete this business? This cannot be undone.')) return
    setSaving(true)
    await fetch(`/api/admin/businesses/${concern.id}`, { method: 'DELETE' })
    router.push('/admin/businesses'); router.refresh()
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Name" required><input value={name} onChange={e=>handleNameChange(e.target.value)} className={inputCls} /></Field>
        <Field label="Slug" required><input value={slug} onChange={e=>setSlug(e.target.value)} className={inputCls} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Industry" required>
          <select value={industry} onChange={e=>setIndustry(e.target.value)} className={selectCls}>
            {industries.map(i=><option key={i} value={i}>{i.replace(/_/g,' ')}</option>)}
          </select>
        </Field>
        <Field label="Website"><input value={website} onChange={e=>setWebsite(e.target.value)} className={inputCls} placeholder="https://" /></Field>
      </div>
      <Field label="Short Description" required>
        <textarea value={shortDescription} onChange={e=>setShortDescription(e.target.value)} rows={2} className={`${inputCls} resize-none`} />
      </Field>
      <Field label="Full Description" required>
        <textarea value={description} onChange={e=>setDescription(e.target.value)} rows={6} className={`${inputCls} resize-y`} />
      </Field>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Display Order"><input value={displayOrder} onChange={e=>setDisplayOrder(e.target.value)} type="number" className={inputCls} /></Field>
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-[#aaa] cursor-pointer"><input type="checkbox" checked={isFeatured} onChange={e=>setIsFeatured(e.target.checked)} className="accent-[#C9A84C]" />Featured on homepage</label>
        <label className="flex items-center gap-2 text-sm text-[#aaa] cursor-pointer"><input type="checkbox" checked={isPublished} onChange={e=>setIsPublished(e.target.checked)} className="accent-[#C9A84C]" />Published</label>
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <SaveBar saving={saving} onSave={save} isEdit={isEdit} previewUrl={isEdit?`/businesses/${concern.slug}`:undefined} onDelete={isEdit?handleDelete:undefined} />
    </div>
  )
}
