'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Phone, Building2 } from 'lucide-react'

const STATUSES = ['NEW','IN_PROGRESS','RESOLVED','ARCHIVED']
const statusColor: Record<string,string> = {
  NEW:'text-[#C9A84C]', IN_PROGRESS:'text-blue-400', RESOLVED:'text-green-400', ARCHIVED:'text-[#555]'
}

export default function InquiryDetail({ inquiry }: { inquiry: any }) {
  const router = useRouter()
  const [status, setStatus] = useState(inquiry.status)
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    await fetch(`/api/admin/inquiries/${inquiry.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setSaving(false)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#111] border border-[#222] p-6 space-y-4">
        <div className="flex items-start justify-between">
          <h2 className="text-white font-medium text-lg">{inquiry.subject}</h2>
          <span className={`font-mono text-xs ${statusColor[inquiry.status]}`}>{inquiry.status.replace('_',' ')}</span>
        </div>
        <div className="space-y-2">
          <div className="text-white text-sm font-medium">{inquiry.name}</div>
          <a href={`mailto:${inquiry.email}`} className="flex items-center gap-2 text-sm text-[#aaa] hover:text-[#C9A84C] transition-colors">
            <Mail size={14} /> {inquiry.email}
          </a>
          {inquiry.phone && (
            <a href={`tel:${inquiry.phone}`} className="flex items-center gap-2 text-sm text-[#aaa] hover:text-[#C9A84C] transition-colors">
              <Phone size={14} /> {inquiry.phone}
            </a>
          )}
          {inquiry.concern && (
            <div className="flex items-center gap-2 text-sm text-[#666]">
              <Building2 size={14} /> {inquiry.concern.name}
            </div>
          )}
        </div>
        <div className="text-xs text-[#555]">
          Received {new Date(inquiry.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <div className="bg-[#111] border border-[#222] p-6">
        <span className="text-xs text-[#666] font-mono uppercase tracking-wider block mb-3">Message</span>
        <p className="text-sm text-[#aaa] leading-relaxed whitespace-pre-wrap">{inquiry.message}</p>
      </div>

      <div className="bg-[#111] border border-[#222] p-6 space-y-4">
        <span className="text-xs text-[#666] font-mono uppercase tracking-wider block">Update Status</span>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map(s => (
            <button key={s} onClick={() => setStatus(s)}
              className={`font-mono text-xs px-3 py-1.5 border transition-colors ${status === s ? 'border-[#C9A84C] text-[#C9A84C] bg-[#C9A84C]/10' : 'border-[#333] text-[#666] hover:border-[#555]'}`}>
              {s.replace('_',' ')}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button onClick={save} disabled={saving}
            className="px-6 py-2.5 bg-[#C9A84C] text-black text-sm font-medium hover:bg-[#E2C97A] transition-colors disabled:opacity-50">
            {saving ? 'Saving…' : 'Save Status'}
          </button>
          <a href={`mailto:${inquiry.email}?subject=Re: ${encodeURIComponent(inquiry.subject)}`}
            className="px-6 py-2.5 border border-[#333] text-sm text-[#aaa] hover:border-[#555] transition-colors">
            Reply by Email
          </a>
        </div>
      </div>

      <Link href="/admin/inquiries" className="text-xs text-[#555] hover:text-[#aaa] transition-colors">← Back to Inquiries</Link>
    </div>
  )
}
