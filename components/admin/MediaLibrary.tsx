'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, Trash2, Copy } from 'lucide-react'

export default function MediaLibrary({ media }: { media: any[] }) {
  const [items, setItems] = useState(media)
  const [uploading, setUploading] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const form = new FormData()
    form.append('file', file)
    form.append('folder', 'media')
    const res = await fetch('/api/media', { method: 'POST', body: form })
    if (res.ok) {
      const data = await res.json()
      setItems(prev => [{ id: Date.now(), url: data.url, filename: data.filename, mimeType: file.type, size: file.size, type: file.type.startsWith('image/') ? 'IMAGE' : 'DOCUMENT', uploadedBy: { name: 'You' }, createdAt: new Date() }, ...prev])
    }
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div>
      {/* Upload button */}
      <div className="mb-6">
        <button onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 bg-[#C9A84C] text-black text-sm font-medium px-4 py-2 hover:bg-[#E2C97A] transition-colors disabled:opacity-50"
          disabled={uploading}>
          <Upload size={14} /> {uploading ? 'Uploading…' : 'Upload File'}
        </button>
        <input ref={fileRef} type="file" accept="image/*,.pdf,.docx" className="hidden" onChange={handleUpload} />
        <p className="text-xs text-[#555] mt-2">Accepted: JPEG, PNG, WebP, GIF, PDF, DOCX · Max 10MB</p>
      </div>

      {/* Grid */}
      {items.length === 0 ? (
        <p className="text-[#555] text-sm py-16 text-center">No media yet. Upload your first file.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {items.map(item => (
            <div key={item.id} className="group relative bg-[#111] border border-[#222] hover:border-[#333] transition-colors">
              {item.type === 'IMAGE' ? (
                <div className="aspect-square relative overflow-hidden">
                  <Image src={item.url} alt={item.filename} fill className="object-cover" />
                </div>
              ) : (
                <div className="aspect-square flex items-center justify-center bg-[#0D0D0D]">
                  <span className="font-mono text-xs text-[#555] uppercase">{item.mimeType?.split('/')[1] || 'file'}</span>
                </div>
              )}
              <div className="p-2">
                <p className="text-[#666] text-[10px] truncate">{item.filename}</p>
              </div>
              {/* Hover actions */}
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button onClick={() => copyUrl(item.url)}
                  className="p-1.5 bg-[#C9A84C] text-black rounded" title="Copy URL">
                  {copied === item.url ? <span className="text-xs px-1">✓</span> : <Copy size={12} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
