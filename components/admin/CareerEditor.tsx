'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import slugify from 'slugify'
import { Field, SaveBar, inputCls, selectCls } from '@/components/admin/AdminFormFields'

export default function CareerEditor({ job }: { job: any }) {
  const router = useRouter()
  const isEdit = !!job
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [title, setTitle] = useState(job?.title || '')
  const [slug, setSlug] = useState(job?.slug || '')
  const [department, setDepartment] = useState(job?.department || '')
  const [location, setLocation] = useState(job?.location || 'Chattogram')
  const [employmentType, setEmploymentType] = useState(job?.employmentType || 'FULL_TIME')
  const [status, setStatus] = useState(job?.status || 'DRAFT')
  const [deadline, setDeadline] = useState(job?.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '')
  const [description, setDescription] = useState(job?.description || '')
  const [responsibilities, setResponsibilities] = useState(job?.responsibilities || '')
  const [requirements, setRequirements] = useState(job?.requirements || '')

  function handleTitleChange(val: string) {
    setTitle(val)
    if (!isEdit) setSlug(slugify(val, { lower: true, strict: true }))
  }

  async function save() {
    setSaving(true); setError('')
    const body = { title, slug, department, location, employmentType, status, description, responsibilities, requirements, deadline: deadline || null }
    try {
      const url = isEdit ? `/api/admin/careers/${job.id}` : '/api/admin/careers'
      const res = await fetch(url, { method: isEdit?'PATCH':'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
      if (!res.ok) { const d=await res.json(); throw new Error(d.error||'Failed') }
      router.push('/admin/careers'); router.refresh()
    } catch(e:any) { setError(e.message); setSaving(false) }
  }

  async function handleDelete() {
    if (!confirm('Delete this job listing?')) return
    await fetch(`/api/admin/careers/${job.id}`, { method: 'DELETE' })
    router.push('/admin/careers'); router.refresh()
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Job Title" required><input value={title} onChange={e=>handleTitleChange(e.target.value)} className={inputCls} placeholder="Senior Software Engineer" /></Field>
        <Field label="Slug" required><input value={slug} onChange={e=>setSlug(e.target.value)} className={inputCls} /></Field>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Department" required><input value={department} onChange={e=>setDepartment(e.target.value)} className={inputCls} placeholder="Engineering" /></Field>
        <Field label="Location" required><input value={location} onChange={e=>setLocation(e.target.value)} className={inputCls} /></Field>
        <Field label="Employment Type" required>
          <select value={employmentType} onChange={e=>setEmploymentType(e.target.value)} className={selectCls}>
            {['FULL_TIME','PART_TIME','CONTRACT','INTERNSHIP'].map(t=><option key={t} value={t}>{t.replace('_',' ')}</option>)}
          </select>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Status" required>
          <select value={status} onChange={e=>setStatus(e.target.value)} className={selectCls}>
            {['DRAFT','OPEN','CLOSED'].map(s=><option key={s} value={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Application Deadline">
          <input type="date" value={deadline} onChange={e=>setDeadline(e.target.value)} className={inputCls} />
        </Field>
      </div>
      <Field label="Role Description" required>
        <textarea value={description} onChange={e=>setDescription(e.target.value)} rows={5} className={`${inputCls} resize-y`} placeholder="Overview of the role..." />
      </Field>
      <Field label="Responsibilities" required>
        <textarea value={responsibilities} onChange={e=>setResponsibilities(e.target.value)} rows={5} className={`${inputCls} resize-y`} placeholder="Use HTML list tags: <ul><li>...</li></ul>" />
      </Field>
      <Field label="Requirements" required>
        <textarea value={requirements} onChange={e=>setRequirements(e.target.value)} rows={5} className={`${inputCls} resize-y`} placeholder="Use HTML list tags: <ul><li>...</li></ul>" />
      </Field>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <SaveBar saving={saving} onSave={save} isEdit={isEdit} previewUrl={isEdit&&job.status==='OPEN'?`/careers/${job.slug}`:undefined} onDelete={isEdit?handleDelete:undefined} />
    </div>
  )
}
