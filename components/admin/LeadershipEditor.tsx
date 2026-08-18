'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Field, SaveBar, inputCls } from '@/components/admin/AdminFormFields'

export default function LeadershipEditor({ member }: { member: any }) {
  const router = useRouter()
  const isEdit = !!member
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [name, setName] = useState(member?.name || '')
  const [position, setPosition] = useState(member?.position || '')
  const [biography, setBiography] = useState(member?.biography || '')
  const [quote, setQuote] = useState(member?.quote || '')
  const [linkedinUrl, setLinkedinUrl] = useState(member?.linkedinUrl || '')
  const [displayOrder, setDisplayOrder] = useState(member?.displayOrder?.toString() || '0')
  const [isPublished, setIsPublished] = useState(member?.isPublished ?? true)

  async function save() {
    setSaving(true); setError('')
    const body = { name, position, biography, quote: quote||null, linkedinUrl: linkedinUrl||null, displayOrder: parseInt(displayOrder)||0, isPublished }
    try {
      const url = isEdit ? `/api/admin/leadership/${member.id}` : '/api/admin/leadership'
      const res = await fetch(url, { method: isEdit?'PATCH':'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) })
      if (!res.ok) { const d=await res.json(); throw new Error(d.error||'Failed') }
      router.push('/admin/leadership'); router.refresh()
    } catch(e:any) { setError(e.message); setSaving(false) }
  }

  async function handleDelete() {
    if (!confirm('Delete this member?')) return
    await fetch(`/api/admin/leadership/${member.id}`, { method: 'DELETE' })
    router.push('/admin/leadership'); router.refresh()
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Full Name" required><input value={name} onChange={e=>setName(e.target.value)} className={inputCls} /></Field>
        <Field label="Position / Title" required><input value={position} onChange={e=>setPosition(e.target.value)} className={inputCls} placeholder="Managing Director" /></Field>
      </div>
      <Field label="Biography" required>
        <textarea value={biography} onChange={e=>setBiography(e.target.value)} rows={6} className={`${inputCls} resize-y`} />
      </Field>
      <Field label="Quote (optional)">
        <textarea value={quote} onChange={e=>setQuote(e.target.value)} rows={3} className={`${inputCls} resize-none`} placeholder="An inspiring quote..." />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="LinkedIn URL"><input value={linkedinUrl} onChange={e=>setLinkedinUrl(e.target.value)} className={inputCls} placeholder="https://linkedin.com/in/..." /></Field>
        <Field label="Display Order"><input value={displayOrder} onChange={e=>setDisplayOrder(e.target.value)} type="number" className={inputCls} /></Field>
      </div>
      <label className="flex items-center gap-2 text-sm text-[#aaa] cursor-pointer">
        <input type="checkbox" checked={isPublished} onChange={e=>setIsPublished(e.target.checked)} className="accent-[#C9A84C]" />Published (visible on site)
      </label>
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <SaveBar saving={saving} onSave={save} isEdit={isEdit} onDelete={isEdit?handleDelete:undefined} />
    </div>
  )
}
