'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FileText, Mail, Phone } from 'lucide-react'

const STATUSES = ['NEW','REVIEWING','SHORTLISTED','INTERVIEW','REJECTED','HIRED']
const statusColor: Record<string,string> = {
  NEW:'text-[#C9A84C]', REVIEWING:'text-blue-400', SHORTLISTED:'text-purple-400',
  INTERVIEW:'text-yellow-400', REJECTED:'text-red-400', HIRED:'text-green-400'
}

export default function ApplicationDetail({ application }: { application: any }) {
  const router = useRouter()
  const [status, setStatus] = useState(application.status)
  const [notes, setNotes] = useState(application.notes || '')
  const [saving, setSaving] = useState(false)

  async function save() {
    setSaving(true)
    await fetch(`/api/admin/applications/${application.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes }),
    })
    setSaving(false)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* Applicant info */}
      <div className="bg-[#111] border border-[#222] p-6 space-y-4">
        <h2 className="text-white font-medium text-lg">{application.name}</h2>
        <div className="space-y-2">
          <a href={`mailto:${application.email}`} className="flex items-center gap-2 text-sm text-[#aaa] hover:text-[#C9A84C] transition-colors">
            <Mail size={14} /> {application.email}
          </a>
          {application.phone && (
            <a href={`tel:${application.phone}`} className="flex items-center gap-2 text-sm text-[#aaa] hover:text-[#C9A84C] transition-colors">
              <Phone size={14} /> {application.phone}
            </a>
          )}
        </div>
        <div className="text-xs text-[#555]">
          Submitted {new Date(application.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* CV download */}
      <div className="bg-[#111] border border-[#222] p-6">
        <span className="text-xs text-[#666] font-mono uppercase tracking-wider block mb-3">Resume / CV</span>
        <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-3 text-[#C9A84C] hover:text-[#E2C97A] transition-colors">
          <FileText size={16} />
          <span className="text-sm">Download CV</span>
        </a>
      </div>

      {/* Cover letter */}
      {application.coverLetter && (
        <div className="bg-[#111] border border-[#222] p-6">
          <span className="text-xs text-[#666] font-mono uppercase tracking-wider block mb-3">Cover Letter</span>
          <p className="text-sm text-[#aaa] leading-relaxed whitespace-pre-wrap">{application.coverLetter}</p>
        </div>
      )}

      {/* Status update */}
      <div className="bg-[#111] border border-[#222] p-6 space-y-4">
        <span className="text-xs text-[#666] font-mono uppercase tracking-wider block">Update Status</span>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map(s => (
            <button key={s} onClick={() => setStatus(s)}
              className={`font-mono text-xs px-3 py-1.5 border transition-colors ${status === s ? 'border-[#C9A84C] text-[#C9A84C] bg-[#C9A84C]/10' : 'border-[#333] text-[#666] hover:border-[#555]'}`}>
              {s}
            </button>
          ))}
        </div>
        <div>
          <label className="text-xs text-[#666] font-mono uppercase tracking-wider block mb-2">Internal Notes</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
            className="w-full bg-[#0D0D0D] border border-[#222] px-4 py-2.5 text-sm text-white placeholder:text-[#444] focus:border-[#C9A84C] focus:outline-none transition-colors resize-none"
            placeholder="Notes visible only to admin team..." />
        </div>
        <button onClick={save} disabled={saving}
          className="px-6 py-2.5 bg-[#C9A84C] text-black text-sm font-medium hover:bg-[#E2C97A] transition-colors disabled:opacity-50">
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      <Link href="/admin/applications" className="text-xs text-[#555] hover:text-[#aaa] transition-colors">← Back to Applications</Link>
    </div>
  )
}
