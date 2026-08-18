'use client'
import { useState } from 'react'
import { inputCls, labelCls } from '@/components/admin/AdminFormFields'

const FIELDS = [
  { key: 'site_name', label: 'Site Name' },
  { key: 'tagline', label: 'Tagline' },
  { key: 'established', label: 'Established Year' },
  { key: 'stat_projects', label: 'Stat: Projects (e.g. 6+)' },
  { key: 'stat_employees', label: 'Stat: Team Members (e.g. 80+)' },
  { key: 'stat_investment', label: 'Stat: Investment (e.g. Multi-Million USD)' },
  { key: 'stat_asset_base', label: 'Stat: Asset Base (e.g. BDT 190+ Crore)' },
  { key: 'address', label: 'Office Address' },
  { key: 'phone', label: 'Phone Number' },
  { key: 'email', label: 'Contact Email' },
  { key: 'office_hours', label: 'Office Hours' },
  { key: 'facebook_url', label: 'Facebook URL' },
  { key: 'linkedin_url', label: 'LinkedIn URL' },
  { key: 'seo_title', label: 'Default SEO Title' },
  { key: 'seo_description', label: 'Default SEO Description' },
]

export default function SiteSettingsEditor({ settings }: { settings: Record<string, string> }) {
  const [values, setValues] = useState<Record<string, string>>(settings)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function set(key: string, val: string) {
    setValues(prev => ({ ...prev, [key]: val }))
    setSaved(false)
  }

  async function save() {
    setSaving(true); setError('')
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error('Failed to save')
      setSaved(true)
    } catch(e: any) { setError(e.message) }
    setSaving(false)
  }

  return (
    <div className="space-y-5">
      {FIELDS.map(f => (
        <div key={f.key}>
          <label className={labelCls}>{f.label}</label>
          {f.key.includes('description') || f.key === 'address' ? (
            <textarea value={values[f.key] || ''} onChange={e => set(f.key, e.target.value)}
              rows={2} className={`${inputCls} resize-none`} />
          ) : (
            <input value={values[f.key] || ''} onChange={e => set(f.key, e.target.value)} className={inputCls} />
          )}
        </div>
      ))}
      {error && <p className="text-red-400 text-sm">{error}</p>}
      {saved && <p className="text-green-400 text-sm">Settings saved.</p>}
      <button onClick={save} disabled={saving}
        className="px-8 py-2.5 bg-[#C9A84C] text-black text-sm font-medium hover:bg-[#E2C97A] transition-colors disabled:opacity-50">
        {saving ? 'Saving…' : 'Save All Settings'}
      </button>
    </div>
  )
}
