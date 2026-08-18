'use client'

import { useState, useRef } from 'react'
import { Upload, CheckCircle } from 'lucide-react'

interface Props { jobId: string; jobTitle: string }

export default function JobApplicationForm({ jobId, jobTitle }: Props) {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'submitting' | 'done' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [fileName, setFileName] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('uploading')
    setErrorMsg('')

    const form = new FormData(e.currentTarget)
    const file = fileRef.current?.files?.[0]

    if (!file) { setErrorMsg('Please attach your CV.'); setStatus('idle'); return }

    // Validate file type client-side (server re-validates)
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowed.includes(file.type)) {
      setErrorMsg('Only PDF or DOCX files are accepted.')
      setStatus('idle')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('File must be under 10MB.')
      setStatus('idle')
      return
    }

    try {
      // Step 1: Upload file
      const uploadForm = new FormData()
      uploadForm.append('file', file)
      uploadForm.append('folder', 'cvs')

      const uploadRes = await fetch('/api/media', { method: 'POST', body: uploadForm })
      if (!uploadRes.ok) throw new Error('File upload failed.')
      const { url: resumeUrl } = await uploadRes.json()

      // Step 2: Submit application
      setStatus('submitting')
      const appRes = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          name: form.get('name'),
          email: form.get('email'),
          phone: form.get('phone'),
          coverLetter: form.get('coverLetter'),
          resumeUrl,
        }),
      })

      if (!appRes.ok) throw new Error('Application submission failed.')
      setStatus('done')
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="p-8 border border-sg-gold/30 bg-sg-deep flex items-start gap-4">
        <CheckCircle size={20} className="text-sg-gold mt-1 shrink-0" />
        <div>
          <h3 className="font-display text-xl font-light text-sg-white mb-2">Application submitted.</h3>
          <p className="font-sans text-sm text-sg-muted">
            Thank you for applying for {jobTitle}. We'll review your application and be in touch.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="name" placeholder="Full Name" required
        className="w-full bg-sg-deep border border-sg-border px-4 py-3 text-sm text-sg-light placeholder:text-sg-muted focus:border-sg-gold focus:outline-none transition-colors" />
      <input name="email" type="email" placeholder="Email Address" required
        className="w-full bg-sg-deep border border-sg-border px-4 py-3 text-sm text-sg-light placeholder:text-sg-muted focus:border-sg-gold focus:outline-none transition-colors" />
      <input name="phone" placeholder="Phone Number" required
        className="w-full bg-sg-deep border border-sg-border px-4 py-3 text-sm text-sg-light placeholder:text-sg-muted focus:border-sg-gold focus:outline-none transition-colors" />
      <textarea name="coverLetter" placeholder="Cover letter (optional)" rows={4}
        className="w-full bg-sg-deep border border-sg-border px-4 py-3 text-sm text-sg-light placeholder:text-sg-muted focus:border-sg-gold focus:outline-none transition-colors resize-none" />

      {/* File upload */}
      <div>
        <label
          className="flex items-center gap-3 w-full bg-sg-deep border border-sg-border px-4 py-3 cursor-pointer hover:border-sg-gold transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          <Upload size={16} className="text-sg-muted shrink-0" />
          <span className="font-sans text-sm text-sg-muted">
            {fileName || 'Attach CV (PDF or DOCX, max 10MB)'}
          </span>
        </label>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
        />
      </div>

      {errorMsg && <p className="font-sans text-xs text-red-400">{errorMsg}</p>}

      <button type="submit"
        disabled={status === 'uploading' || status === 'submitting'}
        className="sg-btn-primary w-full justify-center disabled:opacity-50">
        {status === 'uploading' ? 'Uploading CV…' : status === 'submitting' ? 'Submitting…' : 'Submit Application'}
      </button>
    </form>
  )
}
