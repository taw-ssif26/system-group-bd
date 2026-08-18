'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import slugify from 'slugify'
import { Field, SaveBar, inputCls, labelCls, selectCls } from '@/components/admin/AdminFormFields'

interface Props {
  project: any
  concerns: { id: string; name: string }[]
}

export default function ProjectEditor({ project, concerns }: Props) {
  const router = useRouter()
  const isEdit = !!project
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [name, setName] = useState(project?.name || '')
  const [slug, setSlug] = useState(project?.slug || '')
  const [description, setDescription] = useState(project?.description || '')
  const [location, setLocation] = useState(project?.location || '')
  const [status, setStatus] = useState(project?.status || 'ONGOING')
  const [investment, setInvestment] = useState(project?.investment || '')
  const [completionYear, setCompletionYear] = useState(project?.completionYear?.toString() || '')
  const [sisterConcernId, setSisterConcernId] = useState(project?.sisterConcernId || concerns[0]?.id || '')
  const [isFeatured, setIsFeatured] = useState(project?.isFeatured || false)
  const [isPublished, setIsPublished] = useState(project?.isPublished ?? true)
  const [displayOrder, setDisplayOrder] = useState(project?.displayOrder?.toString() || '0')

  function handleNameChange(val: string) {
    setName(val)
    if (!isEdit) setSlug(slugify(val, { lower: true, strict: true }))
  }

  async function save() {
    setSaving(true)
    setError('')
    const body = {
      name, slug, description, location, status,
      investment: investment || null,
      completionYear: completionYear ? parseInt(completionYear) : null,
      sisterConcernId, isFeatured, isPublished,
      displayOrder: parseInt(displayOrder) || 0,
    }
    try {
      const url = isEdit ? `/api/admin/projects/${project.id}` : '/api/admin/projects'
      const res = await fetch(url, {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Failed') }
      router.push('/admin/projects')
      router.refresh()
    } catch (e: any) { setError(e.message); setSaving(false) }
  }

  async function handleDelete() {
    if (!confirm('Soft-delete this project? It will be hidden from the public site.')) return
    setSaving(true)
    await fetch(`/api/admin/projects/${project.id}`, { method: 'DELETE' })
    router.push('/admin/projects')
    router.refresh()
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Project Name" required>
          <input value={name} onChange={e => handleNameChange(e.target.value)} className={inputCls} placeholder="System Imperial Complex" />
        </Field>
        <Field label="Slug" required>
          <input value={slug} onChange={e => setSlug(e.target.value)} className={inputCls} placeholder="system-imperial-complex" />
        </Field>
      </div>

      <Field label="Sister Concern" required>
        <select value={sisterConcernId} onChange={e => setSisterConcernId(e.target.value)} className={selectCls}>
          {concerns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Status" required>
          <select value={status} onChange={e => setStatus(e.target.value)} className={selectCls}>
            {['UPCOMING', 'ONGOING', 'COMPLETED', 'AVAILABLE'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="Location" required>
          <input value={location} onChange={e => setLocation(e.target.value)} className={inputCls} placeholder="Chattogram" />
        </Field>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Field label="Investment">
          <input value={investment} onChange={e => setInvestment(e.target.value)} className={inputCls} placeholder="$3 million" />
        </Field>
        <Field label="Completion Year">
          <input value={completionYear} onChange={e => setCompletionYear(e.target.value)} className={inputCls} placeholder="2024" type="number" />
        </Field>
        <Field label="Display Order">
          <input value={displayOrder} onChange={e => setDisplayOrder(e.target.value)} className={inputCls} type="number" />
        </Field>
      </div>

      <Field label="Description" required>
        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={6}
          className={`${inputCls} resize-y`} placeholder="Project description..." />
      </Field>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-sm text-[#aaa] cursor-pointer">
          <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} className="accent-[#C9A84C]" />
          Featured on homepage
        </label>
        <label className="flex items-center gap-2 text-sm text-[#aaa] cursor-pointer">
          <input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} className="accent-[#C9A84C]" />
          Published (visible publicly)
        </label>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <SaveBar
        saving={saving}
        onSave={save}
        isEdit={isEdit}
        previewUrl={isEdit ? `/projects/${project.slug}` : undefined}
        onDelete={isEdit ? handleDelete : undefined}
      />
    </div>
  )
}
